use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{clock::Clock, Sysvar},
};
use spl_token::{
    instruction as token_instruction,
    state::{Account as TokenAccount, Mint},
};
use borsh::{BorshDeserialize, BorshSerialize};

pub mod error;
pub mod instruction;
pub mod processor;
pub mod state;
pub mod client;

use crate::{
    error::EceTokenError,
    instruction::EceTokenInstruction,
    processor::Processor,
};

entrypoint!(process_instruction);

/// Main entry point for the ECE Token program
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = EceTokenInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        EceTokenInstruction::InitializeToken {
            decimals,
            freeze_authority,
        } => {
            msg!("Instruction: Initialize ECE Token");
            Processor::process_initialize_token(program_id, accounts, decimals, freeze_authority)
        }
        EceTokenInstruction::InitializeTreasury {
            signers,
            threshold,
        } => {
            msg!("Instruction: Initialize Treasury");
            Processor::process_initialize_treasury(program_id, accounts, signers, threshold)
        }
        EceTokenInstruction::MintTokens { amount } => {
            msg!("Instruction: Mint ECE Tokens");
            Processor::process_mint_tokens(program_id, accounts, amount)
        }
        EceTokenInstruction::BurnTokens { amount } => {
            msg!("Instruction: Burn ECE Tokens");
            Processor::process_burn_tokens(program_id, accounts, amount)
        }
        EceTokenInstruction::DepositUsdc { amount } => {
            msg!("Instruction: Deposit USDC");
            Processor::process_deposit_usdc(program_id, accounts, amount)
        }
        EceTokenInstruction::WithdrawUsdc { amount } => {
            msg!("Instruction: Withdraw USDC");
            Processor::process_withdraw_usdc(program_id, accounts, amount)
        }
        EceTokenInstruction::WeeklyPayout {
            revenue_amount,
            payout_percentage,
        } => {
            msg!("Instruction: Weekly Payout");
            Processor::process_weekly_payout(program_id, accounts, revenue_amount, payout_percentage)
        }
        EceTokenInstruction::EmergencyPause => {
            msg!("Instruction: Emergency Pause");
            Processor::process_emergency_pause(program_id, accounts)
        }
        EceTokenInstruction::EmergencyUnpause => {
            msg!("Instruction: Emergency Unpause");
            Processor::process_emergency_unpause(program_id, accounts)
        }
        EceTokenInstruction::UpdateTreasury {
            new_signers,
            new_threshold,
        } => {
            msg!("Instruction: Update Treasury");
            Processor::process_update_treasury(program_id, accounts, new_signers, new_threshold)
        }
    }
}
