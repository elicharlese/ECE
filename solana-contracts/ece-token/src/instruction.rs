use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum EceTokenInstruction {
    /// Initialize the ECE token mint
    /// Accounts expected:
    /// 0. `[signer]` The account of the person initializing the token
    /// 1. `[writable]` The token mint account
    /// 2. `[]` Rent sysvar
    /// 3. `[]` Token program
    InitializeToken {
        decimals: u8,
        freeze_authority: Option<Pubkey>,
    },

    /// Initialize the multi-signature treasury
    /// Accounts expected:
    /// 0. `[signer]` The account initializing the treasury
    /// 1. `[writable]` The treasury account
    /// 2. `[]` System program
    /// 3. `[]` Rent sysvar
    InitializeTreasury {
        signers: Vec<Pubkey>,
        threshold: u8,
    },

    /// Mint ECE tokens backed by USDC deposits
    /// Accounts expected:
    /// 0. `[signer]` Treasury authority (multi-sig)
    /// 1. `[writable]` ECE token mint
    /// 2. `[writable]` Destination ECE token account
    /// 3. `[writable]` Source USDC token account
    /// 4. `[writable]` Treasury USDC reserve account
    /// 5. `[writable]` Treasury state account
    /// 6. `[]` Token program
    /// 7. `[]` Clock sysvar
    MintTokens { amount: u64 },

    /// Burn ECE tokens and release USDC
    /// Accounts expected:
    /// 0. `[signer]` Token holder
    /// 1. `[writable]` ECE token mint
    /// 2. `[writable]` Source ECE token account
    /// 3. `[writable]` Destination USDC token account
    /// 4. `[writable]` Treasury USDC reserve account
    /// 5. `[writable]` Treasury state account
    /// 6. `[]` Token program
    /// 7. `[]` Clock sysvar
    BurnTokens { amount: u64 },

    /// Deposit USDC to treasury reserves
    /// Accounts expected:
    /// 0. `[signer]` Depositor
    /// 1. `[writable]` Source USDC account
    /// 2. `[writable]` Treasury USDC reserve account
    /// 3. `[writable]` Treasury state account
    /// 4. `[]` Token program
    /// 5. `[]` Clock sysvar
    DepositUsdc { amount: u64 },

    /// Withdraw USDC from treasury reserves
    /// Accounts expected:
    /// 0. `[signer]` Treasury authority (multi-sig)
    /// 1. `[writable]` Treasury USDC reserve account
    /// 2. `[writable]` Destination USDC account
    /// 3. `[writable]` Treasury state account
    /// 4. `[]` Token program
    /// 5. `[]` Clock sysvar
    WithdrawUsdc { amount: u64 },

    /// Process weekly company payout
    /// Accounts expected:
    /// 0. `[signer]` Treasury authority (multi-sig)
    /// 1. `[writable]` Company ECE revenue account
    /// 2. `[writable]` Company USDC account
    /// 3. `[writable]` Treasury USDC reserve account
    /// 4. `[writable]` Treasury state account
    /// 5. `[writable]` ECE token mint
    /// 6. `[]` Token program
    /// 7. `[]` Clock sysvar
    WeeklyPayout {
        revenue_amount: u64,
        payout_percentage: u8, // 0-100
    },

    /// Emergency pause all operations
    /// Accounts expected:
    /// 0. `[signer]` Emergency authority
    /// 1. `[writable]` Treasury state account
    EmergencyPause,

    /// Emergency unpause operations
    /// Accounts expected:
    /// 0. `[signer]` Emergency authority
    /// 1. `[writable]` Treasury state account
    EmergencyUnpause,

    /// Update treasury signers and threshold
    /// Accounts expected:
    /// 0. `[signer]` Current treasury authority (multi-sig)
    /// 1. `[writable]` Treasury state account
    UpdateTreasury {
        new_signers: Vec<Pubkey>,
        new_threshold: u8,
    },
}
