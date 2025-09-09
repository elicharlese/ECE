use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack},
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::{clock::Clock, Sysvar},
};
use spl_token::{
    instruction as token_instruction,
    state::{Account as TokenAccount, Mint},
};
use borsh::{BorshDeserialize, BorshSerialize};

use crate::{
    error::EceTokenError,
    state::{TreasuryState, WeeklyPayoutRecord, ComplianceRecord, TransactionType},
};

pub struct Processor;

impl Processor {
    /// Initialize the ECE token mint
    pub fn process_initialize_token(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        decimals: u8,
        freeze_authority: Option<Pubkey>,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let initializer = next_account_info(account_info_iter)?;
        let mint_account = next_account_info(account_info_iter)?;
        let rent_sysvar = next_account_info(account_info_iter)?;
        let token_program = next_account_info(account_info_iter)?;

        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let rent = Rent::from_account_info(rent_sysvar)?;
        if !rent.is_exempt(mint_account.lamports(), mint_account.data_len()) {
            return Err(EceTokenError::NotRentExempt.into());
        }

        // Initialize the mint with the program as mint authority
        let init_mint_ix = token_instruction::initialize_mint(
            token_program.key,
            mint_account.key,
            program_id, // Mint authority is the program
            freeze_authority.as_ref(),
            decimals,
        )?;

        invoke(
            &init_mint_ix,
            &[mint_account.clone(), rent_sysvar.clone()],
        )?;

        msg!("ECE Token mint initialized with {} decimals", decimals);
        Ok(())
    }

    /// Initialize the multi-signature treasury
    pub fn process_initialize_treasury(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        signers: Vec<Pubkey>,
        threshold: u8,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let initializer = next_account_info(account_info_iter)?;
        let treasury_account = next_account_info(account_info_iter)?;
        let system_program = next_account_info(account_info_iter)?;
        let rent_sysvar = next_account_info(account_info_iter)?;

        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        if signers.len() < threshold as usize || threshold == 0 {
            return Err(EceTokenError::InvalidSignatureThreshold.into());
        }

        let rent = Rent::from_account_info(rent_sysvar)?;
        let required_space = TreasuryState::LEN;
        let required_lamports = rent.minimum_balance(required_space);

        // Create treasury account
        invoke(
            &system_instruction::create_account(
                initializer.key,
                treasury_account.key,
                required_lamports,
                required_space as u64,
                program_id,
            ),
            &[
                initializer.clone(),
                treasury_account.clone(),
                system_program.clone(),
            ],
        )?;

        // Initialize treasury state
        let mut treasury_state = TreasuryState {
            is_initialized: true,
            signers,
            threshold,
            ece_mint: Pubkey::default(),
            usdc_mint: Pubkey::default(),
            usdc_reserve: Pubkey::default(),
            ece_circulation: 0,
            usdc_reserves: 0,
            is_paused: false,
            emergency_authority: *initializer.key,
            last_payout_timestamp: 0,
            payout_window: 604800, // 7 days in seconds
            min_reserve_ratio: 10000, // 100% backing
            company_revenue_account: Pubkey::default(),
            company_usdc_account: Pubkey::default(),
            total_revenue_processed: 0,
            payout_count: 0,
            compliance_authority: *initializer.key,
            max_transaction_amount: 10_000_000_000, // 10,000 USDC with 6 decimals
            daily_volume_limit: 100_000_000_000, // 100,000 USDC daily limit
            current_daily_volume: 0,
            last_volume_reset: 0,
        };

        treasury_state.serialize(&mut &mut treasury_account.data.borrow_mut()[..])?;

        msg!("Treasury initialized with {} signers, threshold {}", 
             treasury_state.signers.len(), threshold);
        Ok(())
    }

    /// Mint ECE tokens backed by USDC deposits
    pub fn process_mint_tokens(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        amount: u64,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let authority = next_account_info(account_info_iter)?;
        let ece_mint = next_account_info(account_info_iter)?;
        let destination_ece_account = next_account_info(account_info_iter)?;
        let source_usdc_account = next_account_info(account_info_iter)?;
        let treasury_usdc_account = next_account_info(account_info_iter)?;
        let treasury_state_account = next_account_info(account_info_iter)?;
        let token_program = next_account_info(account_info_iter)?;
        let clock_sysvar = next_account_info(account_info_iter)?;

        if !authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let clock = Clock::from_account_info(clock_sysvar)?;
        let mut treasury_state = TreasuryState::try_from_slice(&treasury_state_account.data.borrow())?;

        if treasury_state.is_paused {
            return Err(EceTokenError::EmergencyPauseActive.into());
        }

        // Check compliance limits
        if amount > treasury_state.max_transaction_amount {
            return Err(EceTokenError::ComplianceCheckFailed.into());
        }

        if treasury_state.would_exceed_daily_limit(amount, clock.unix_timestamp) {
            return Err(EceTokenError::ComplianceCheckFailed.into());
        }

        // Transfer USDC from user to treasury reserves (1:1 ratio)
        let transfer_usdc_ix = token_instruction::transfer(
            token_program.key,
            source_usdc_account.key,
            treasury_usdc_account.key,
            authority.key,
            &[],
            amount,
        )?;

        invoke(
            &transfer_usdc_ix,
            &[
                source_usdc_account.clone(),
                treasury_usdc_account.clone(),
                authority.clone(),
                token_program.clone(),
            ],
        )?;

        // Mint ECE tokens to user
        let mint_ece_ix = token_instruction::mint_to(
            token_program.key,
            ece_mint.key,
            destination_ece_account.key,
            program_id, // Program is mint authority
            &[],
            amount,
        )?;

        let seeds = &[b"ece-mint-authority"];
        let seeds_slice: &[&[u8]] = &[b"ece-mint-authority"];
        let (_, bump_seed) = Pubkey::find_program_address(seeds_slice, program_id);
        let signer_seeds = &[b"ece-mint-authority", &[bump_seed]];

        invoke_signed(
            &mint_ece_ix,
            &[
                ece_mint.clone(),
                destination_ece_account.clone(),
                treasury_state_account.clone(),
                token_program.clone(),
            ],
            &[signer_seeds],
        )?;

        // Update treasury state
        treasury_state.ece_circulation += amount;
        treasury_state.usdc_reserves += amount;
        treasury_state.update_daily_volume(amount, clock.unix_timestamp);

        treasury_state.serialize(&mut &mut treasury_state_account.data.borrow_mut()[..])?;

        msg!("Minted {} ECE tokens backed by {} USDC", amount, amount);
        Ok(())
    }

    /// Burn ECE tokens and release USDC
    pub fn process_burn_tokens(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        amount: u64,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let authority = next_account_info(account_info_iter)?;
        let ece_mint = next_account_info(account_info_iter)?;
        let source_ece_account = next_account_info(account_info_iter)?;
        let destination_usdc_account = next_account_info(account_info_iter)?;
        let treasury_usdc_account = next_account_info(account_info_iter)?;
        let treasury_state_account = next_account_info(account_info_iter)?;
        let token_program = next_account_info(account_info_iter)?;
        let clock_sysvar = next_account_info(account_info_iter)?;

        if !authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let clock = Clock::from_account_info(clock_sysvar)?;
        let mut treasury_state = TreasuryState::try_from_slice(&treasury_state_account.data.borrow())?;

        if treasury_state.is_paused {
            return Err(EceTokenError::EmergencyPauseActive.into());
        }

        // Check if treasury has sufficient USDC reserves
        if !treasury_state.has_sufficient_reserves(amount) {
            return Err(EceTokenError::UsdcReserveInsufficient.into());
        }

        // Check compliance limits
        if amount > treasury_state.max_transaction_amount {
            return Err(EceTokenError::ComplianceCheckFailed.into());
        }

        // Burn ECE tokens
        let burn_ece_ix = token_instruction::burn(
            token_program.key,
            source_ece_account.key,
            ece_mint.key,
            authority.key,
            &[],
            amount,
        )?;

        invoke(
            &burn_ece_ix,
            &[
                source_ece_account.clone(),
                ece_mint.clone(),
                authority.clone(),
                token_program.clone(),
            ],
        )?;

        // Transfer USDC from treasury to user
        let transfer_usdc_ix = token_instruction::transfer(
            token_program.key,
            treasury_usdc_account.key,
            destination_usdc_account.key,
            program_id, // Program is treasury authority
            &[],
            amount,
        )?;

        let seeds = &[b"ece-treasury-authority"];
        let (_, bump_seed) = Pubkey::find_program_address(seeds, program_id);
        let signer_seeds = &[&seeds[..], &[bump_seed]];

        invoke_signed(
            &transfer_usdc_ix,
            &[
                treasury_usdc_account.clone(),
                destination_usdc_account.clone(),
                treasury_state_account.clone(),
                token_program.clone(),
            ],
            &[signer_seeds],
        )?;

        // Update treasury state
        treasury_state.ece_circulation -= amount;
        treasury_state.usdc_reserves -= amount;

        treasury_state.serialize(&mut &mut treasury_state_account.data.borrow_mut()[..])?;

        msg!("Burned {} ECE tokens and released {} USDC", amount, amount);
        Ok(())
    }

    /// Process weekly company payout
    pub fn process_weekly_payout(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        revenue_amount: u64,
        payout_percentage: u8,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let authority = next_account_info(account_info_iter)?;
        let company_ece_account = next_account_info(account_info_iter)?;
        let company_usdc_account = next_account_info(account_info_iter)?;
        let treasury_usdc_account = next_account_info(account_info_iter)?;
        let treasury_state_account = next_account_info(account_info_iter)?;
        let ece_mint = next_account_info(account_info_iter)?;
        let token_program = next_account_info(account_info_iter)?;
        let clock_sysvar = next_account_info(account_info_iter)?;

        if !authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        if payout_percentage > 100 {
            return Err(EceTokenError::InvalidPayoutPercentage.into());
        }

        let clock = Clock::from_account_info(clock_sysvar)?;
        let mut treasury_state = TreasuryState::try_from_slice(&treasury_state_account.data.borrow())?;

        if treasury_state.is_paused {
            return Err(EceTokenError::EmergencyPauseActive.into());
        }

        // Check if weekly payout window is active
        if !treasury_state.is_payout_window_active(clock.unix_timestamp) {
            return Err(EceTokenError::WeeklyPayoutWindowNotActive.into());
        }

        // Calculate payout amounts
        let payout_amount = (revenue_amount as u128 * payout_percentage as u128 / 100) as u64;
        let remaining_ece = revenue_amount - payout_amount;

        // Check if treasury has sufficient USDC for the payout
        if !treasury_state.has_sufficient_reserves(payout_amount) {
            return Err(EceTokenError::UsdcReserveInsufficient.into());
        }

        // Burn ECE tokens from company revenue
        let burn_ece_ix = token_instruction::burn(
            token_program.key,
            company_ece_account.key,
            ece_mint.key,
            authority.key,
            &[],
            payout_amount,
        )?;

        invoke(
            &burn_ece_ix,
            &[
                company_ece_account.clone(),
                ece_mint.clone(),
                authority.clone(),
                token_program.clone(),
            ],
        )?;

        // Transfer equivalent USDC to company
        let transfer_usdc_ix = token_instruction::transfer(
            token_program.key,
            treasury_usdc_account.key,
            company_usdc_account.key,
            program_id,
            &[],
            payout_amount,
        )?;

        let seeds = &[b"ece-treasury-authority"];
        let (_, bump_seed) = Pubkey::find_program_address(seeds, program_id);
        let signer_seeds = &[&seeds[..], &[bump_seed]];

        invoke_signed(
            &transfer_usdc_ix,
            &[
                treasury_usdc_account.clone(),
                company_usdc_account.clone(),
                treasury_state_account.clone(),
                token_program.clone(),
            ],
            &[signer_seeds],
        )?;

        // Update treasury state
        treasury_state.ece_circulation -= payout_amount;
        treasury_state.usdc_reserves -= payout_amount;
        treasury_state.last_payout_timestamp = clock.unix_timestamp;
        treasury_state.total_revenue_processed += revenue_amount;
        treasury_state.payout_count += 1;

        treasury_state.serialize(&mut &mut treasury_state_account.data.borrow_mut()[..])?;

        msg!("Processed weekly payout: {} ECE burned, {} USDC released to company, {} ECE retained",
             payout_amount, payout_amount, remaining_ece);
        Ok(())
    }

    /// Deposit USDC to treasury reserves
    pub fn process_deposit_usdc(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        amount: u64,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let depositor = next_account_info(account_info_iter)?;
        let source_usdc_account = next_account_info(account_info_iter)?;
        let treasury_usdc_account = next_account_info(account_info_iter)?;
        let treasury_state_account = next_account_info(account_info_iter)?;
        let token_program = next_account_info(account_info_iter)?;
        let clock_sysvar = next_account_info(account_info_iter)?;

        if !depositor.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let clock = Clock::from_account_info(clock_sysvar)?;
        let mut treasury_state = TreasuryState::try_from_slice(&treasury_state_account.data.borrow())?;

        if treasury_state.is_paused {
            return Err(EceTokenError::EmergencyPauseActive.into());
        }

        // Transfer USDC to treasury
        let transfer_ix = token_instruction::transfer(
            token_program.key,
            source_usdc_account.key,
            treasury_usdc_account.key,
            depositor.key,
            &[],
            amount,
        )?;

        invoke(
            &transfer_ix,
            &[
                source_usdc_account.clone(),
                treasury_usdc_account.clone(),
                depositor.clone(),
                token_program.clone(),
            ],
        )?;

        // Update treasury reserves
        treasury_state.usdc_reserves += amount;
        treasury_state.serialize(&mut &mut treasury_state_account.data.borrow_mut()[..])?;

        msg!("Deposited {} USDC to treasury reserves", amount);
        Ok(())
    }

    /// Withdraw USDC from treasury reserves (multi-sig required)
    pub fn process_withdraw_usdc(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        amount: u64,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let authority = next_account_info(account_info_iter)?;
        let treasury_usdc_account = next_account_info(account_info_iter)?;
        let destination_usdc_account = next_account_info(account_info_iter)?;
        let treasury_state_account = next_account_info(account_info_iter)?;
        let token_program = next_account_info(account_info_iter)?;
        let clock_sysvar = next_account_info(account_info_iter)?;

        // Validate multi-signature authority (simplified for example)
        if !authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let mut treasury_state = TreasuryState::try_from_slice(&treasury_state_account.data.borrow())?;

        if treasury_state.is_paused {
            return Err(EceTokenError::EmergencyPauseActive.into());
        }

        if treasury_state.usdc_reserves < amount {
            return Err(EceTokenError::UsdcReserveInsufficient.into());
        }

        // Check if withdrawal would compromise reserve ratio
        let new_reserves = treasury_state.usdc_reserves - amount;
        if treasury_state.ece_circulation > 0 {
            let new_ratio = (new_reserves as u128 * 10000) / treasury_state.ece_circulation as u128;
            if new_ratio < treasury_state.min_reserve_ratio as u128 {
                return Err(EceTokenError::ReserveRatioBelowMinimum.into());
            }
        }

        // Transfer USDC from treasury
        let transfer_ix = token_instruction::transfer(
            token_program.key,
            treasury_usdc_account.key,
            destination_usdc_account.key,
            program_id,
            &[],
            amount,
        )?;

        let seeds = &[b"ece-treasury-authority"];
        let (_, bump_seed) = Pubkey::find_program_address(seeds, program_id);
        let signer_seeds = &[&seeds[..], &[bump_seed]];

        invoke_signed(
            &transfer_ix,
            &[
                treasury_usdc_account.clone(),
                destination_usdc_account.clone(),
                treasury_state_account.clone(),
                token_program.clone(),
            ],
            &[signer_seeds],
        )?;

        // Update treasury reserves
        treasury_state.usdc_reserves -= amount;
        treasury_state.serialize(&mut &mut treasury_state_account.data.borrow_mut()[..])?;

        msg!("Withdrew {} USDC from treasury reserves", amount);
        Ok(())
    }

    /// Emergency pause all operations
    pub fn process_emergency_pause(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let emergency_authority = next_account_info(account_info_iter)?;
        let treasury_state_account = next_account_info(account_info_iter)?;

        if !emergency_authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let mut treasury_state = TreasuryState::try_from_slice(&treasury_state_account.data.borrow())?;

        if emergency_authority.key != &treasury_state.emergency_authority {
            return Err(EceTokenError::UnauthorizedSigner.into());
        }

        treasury_state.is_paused = true;
        treasury_state.serialize(&mut &mut treasury_state_account.data.borrow_mut()[..])?;

        msg!("Emergency pause activated by authority");
        Ok(())
    }

    /// Emergency unpause operations
    pub fn process_emergency_unpause(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let emergency_authority = next_account_info(account_info_iter)?;
        let treasury_state_account = next_account_info(account_info_iter)?;

        if !emergency_authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let mut treasury_state = TreasuryState::try_from_slice(&treasury_state_account.data.borrow())?;

        if emergency_authority.key != &treasury_state.emergency_authority {
            return Err(EceTokenError::UnauthorizedSigner.into());
        }

        if !treasury_state.is_paused {
            return Err(EceTokenError::NotPaused.into());
        }

        treasury_state.is_paused = false;
        treasury_state.serialize(&mut &mut treasury_state_account.data.borrow_mut()[..])?;

        msg!("Emergency pause deactivated by authority");
        Ok(())
    }

    /// Update treasury signers and threshold
    pub fn process_update_treasury(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        new_signers: Vec<Pubkey>,
        new_threshold: u8,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let authority = next_account_info(account_info_iter)?;
        let treasury_state_account = next_account_info(account_info_iter)?;

        if !authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let mut treasury_state = TreasuryState::try_from_slice(&treasury_state_account.data.borrow())?;

        // Validate that current authority can make this change
        if !treasury_state.signers.contains(authority.key) {
            return Err(EceTokenError::UnauthorizedSigner.into());
        }

        if new_signers.len() < new_threshold as usize || new_threshold == 0 {
            return Err(EceTokenError::InvalidSignatureThreshold.into());
        }

        treasury_state.signers = new_signers;
        treasury_state.threshold = new_threshold;

        treasury_state.serialize(&mut &mut treasury_state_account.data.borrow_mut()[..])?;

        msg!("Treasury updated with {} signers, threshold {}", 
             treasury_state.signers.len(), new_threshold);
        Ok(())
    }
}
