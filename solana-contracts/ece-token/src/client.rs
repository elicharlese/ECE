use solana_program::pubkey::Pubkey;
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    system_program,
    sysvar,
};
use spl_token;
use borsh::BorshSerialize;

use crate::instruction::EceTokenInstruction;

/// Client helper functions for interacting with the ECE Token program
pub struct EceTokenClient;

impl EceTokenClient {
    /// Create instruction to initialize ECE token mint
    pub fn initialize_token(
        program_id: &Pubkey,
        initializer: &Pubkey,
        mint: &Pubkey,
        decimals: u8,
        freeze_authority: Option<Pubkey>,
    ) -> Result<Instruction, Box<dyn std::error::Error>> {
        let instruction_data = EceTokenInstruction::InitializeToken {
            decimals,
            freeze_authority,
        };

        Ok(Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new(*initializer, true),
                AccountMeta::new(*mint, false),
                AccountMeta::new_readonly(sysvar::rent::id(), false),
                AccountMeta::new_readonly(spl_token::id(), false),
            ],
            data: instruction_data.try_to_vec()?,
        })
    }

    /// Create instruction to initialize treasury
    pub fn initialize_treasury(
        program_id: &Pubkey,
        initializer: &Pubkey,
        treasury_account: &Pubkey,
        signers: Vec<Pubkey>,
        threshold: u8,
    ) -> Result<Instruction, Box<dyn std::error::Error>> {
        let instruction_data = EceTokenInstruction::InitializeTreasury {
            signers,
            threshold,
        };

        Ok(Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new(*initializer, true),
                AccountMeta::new(*treasury_account, false),
                AccountMeta::new_readonly(system_program::id(), false),
                AccountMeta::new_readonly(sysvar::rent::id(), false),
            ],
            data: instruction_data.try_to_vec()?,
        })
    }

    /// Create instruction to mint ECE tokens
    pub fn mint_tokens(
        program_id: &Pubkey,
        authority: &Pubkey,
        ece_mint: &Pubkey,
        destination_ece_account: &Pubkey,
        source_usdc_account: &Pubkey,
        treasury_usdc_account: &Pubkey,
        treasury_state_account: &Pubkey,
        amount: u64,
    ) -> Result<Instruction, Box<dyn std::error::Error>> {
        let instruction_data = EceTokenInstruction::MintTokens { amount };

        Ok(Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new(*authority, true),
                AccountMeta::new(*ece_mint, false),
                AccountMeta::new(*destination_ece_account, false),
                AccountMeta::new(*source_usdc_account, false),
                AccountMeta::new(*treasury_usdc_account, false),
                AccountMeta::new(*treasury_state_account, false),
                AccountMeta::new_readonly(spl_token::id(), false),
                AccountMeta::new_readonly(sysvar::clock::id(), false),
            ],
            data: instruction_data.try_to_vec()?,
        })
    }

    /// Create instruction to burn ECE tokens
    pub fn burn_tokens(
        program_id: &Pubkey,
        authority: &Pubkey,
        ece_mint: &Pubkey,
        source_ece_account: &Pubkey,
        destination_usdc_account: &Pubkey,
        treasury_usdc_account: &Pubkey,
        treasury_state_account: &Pubkey,
        amount: u64,
    ) -> Result<Instruction, Box<dyn std::error::Error>> {
        let instruction_data = EceTokenInstruction::BurnTokens { amount };

        Ok(Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new(*authority, true),
                AccountMeta::new(*ece_mint, false),
                AccountMeta::new(*source_ece_account, false),
                AccountMeta::new(*destination_usdc_account, false),
                AccountMeta::new(*treasury_usdc_account, false),
                AccountMeta::new(*treasury_state_account, false),
                AccountMeta::new_readonly(spl_token::id(), false),
                AccountMeta::new_readonly(sysvar::clock::id(), false),
            ],
            data: instruction_data.try_to_vec()?,
        })
    }

    /// Create instruction for weekly payout
    pub fn weekly_payout(
        program_id: &Pubkey,
        authority: &Pubkey,
        company_ece_account: &Pubkey,
        company_usdc_account: &Pubkey,
        treasury_usdc_account: &Pubkey,
        treasury_state_account: &Pubkey,
        ece_mint: &Pubkey,
        revenue_amount: u64,
        payout_percentage: u8,
    ) -> Result<Instruction, Box<dyn std::error::Error>> {
        let instruction_data = EceTokenInstruction::WeeklyPayout {
            revenue_amount,
            payout_percentage,
        };

        Ok(Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new(*authority, true),
                AccountMeta::new(*company_ece_account, false),
                AccountMeta::new(*company_usdc_account, false),
                AccountMeta::new(*treasury_usdc_account, false),
                AccountMeta::new(*treasury_state_account, false),
                AccountMeta::new(*ece_mint, false),
                AccountMeta::new_readonly(spl_token::id(), false),
                AccountMeta::new_readonly(sysvar::clock::id(), false),
            ],
            data: instruction_data.try_to_vec()?,
        })
    }

    /// Create instruction to deposit USDC
    pub fn deposit_usdc(
        program_id: &Pubkey,
        depositor: &Pubkey,
        source_usdc_account: &Pubkey,
        treasury_usdc_account: &Pubkey,
        treasury_state_account: &Pubkey,
        amount: u64,
    ) -> Result<Instruction, Box<dyn std::error::Error>> {
        let instruction_data = EceTokenInstruction::DepositUsdc { amount };

        Ok(Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new(*depositor, true),
                AccountMeta::new(*source_usdc_account, false),
                AccountMeta::new(*treasury_usdc_account, false),
                AccountMeta::new(*treasury_state_account, false),
                AccountMeta::new_readonly(spl_token::id(), false),
                AccountMeta::new_readonly(sysvar::clock::id(), false),
            ],
            data: instruction_data.try_to_vec()?,
        })
    }

    /// Create instruction to withdraw USDC
    pub fn withdraw_usdc(
        program_id: &Pubkey,
        authority: &Pubkey,
        treasury_usdc_account: &Pubkey,
        destination_usdc_account: &Pubkey,
        treasury_state_account: &Pubkey,
        amount: u64,
    ) -> Result<Instruction, Box<dyn std::error::Error>> {
        let instruction_data = EceTokenInstruction::WithdrawUsdc { amount };

        Ok(Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new(*authority, true),
                AccountMeta::new(*treasury_usdc_account, false),
                AccountMeta::new(*destination_usdc_account, false),
                AccountMeta::new(*treasury_state_account, false),
                AccountMeta::new_readonly(spl_token::id(), false),
                AccountMeta::new_readonly(sysvar::clock::id(), false),
            ],
            data: instruction_data.try_to_vec()?,
        })
    }

    /// Create instruction for emergency pause
    pub fn emergency_pause(
        program_id: &Pubkey,
        emergency_authority: &Pubkey,
        treasury_state_account: &Pubkey,
    ) -> Result<Instruction, Box<dyn std::error::Error>> {
        let instruction_data = EceTokenInstruction::EmergencyPause;

        Ok(Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new(*emergency_authority, true),
                AccountMeta::new(*treasury_state_account, false),
            ],
            data: instruction_data.try_to_vec()?,
        })
    }

    /// Create instruction for emergency unpause
    pub fn emergency_unpause(
        program_id: &Pubkey,
        emergency_authority: &Pubkey,
        treasury_state_account: &Pubkey,
    ) -> Result<Instruction, Box<dyn std::error::Error>> {
        let instruction_data = EceTokenInstruction::EmergencyUnpause;

        Ok(Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new(*emergency_authority, true),
                AccountMeta::new(*treasury_state_account, false),
            ],
            data: instruction_data.try_to_vec()?,
        })
    }

    /// Create instruction to update treasury
    pub fn update_treasury(
        program_id: &Pubkey,
        authority: &Pubkey,
        treasury_state_account: &Pubkey,
        new_signers: Vec<Pubkey>,
        new_threshold: u8,
    ) -> Result<Instruction, Box<dyn std::error::Error>> {
        let instruction_data = EceTokenInstruction::UpdateTreasury {
            new_signers,
            new_threshold,
        };

        Ok(Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new(*authority, true),
                AccountMeta::new(*treasury_state_account, false),
            ],
            data: instruction_data.try_to_vec()?,
        })
    }
}
