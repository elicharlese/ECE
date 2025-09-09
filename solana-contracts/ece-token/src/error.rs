use thiserror::Error;
use solana_program::program_error::ProgramError;

#[derive(Error, Debug, Copy, Clone)]
pub enum EceTokenError {
    #[error("Invalid instruction")]
    InvalidInstruction,
    
    #[error("Not rent exempt")]
    NotRentExempt,
    
    #[error("Expected amount mismatch")]
    ExpectedAmountMismatch,
    
    #[error("Amount overflow")]
    AmountOverflow,
    
    #[error("Insufficient funds")]
    InsufficientFunds,
    
    #[error("Invalid token mint")]
    InvalidTokenMint,
    
    #[error("Invalid token account")]
    InvalidTokenAccount,
    
    #[error("Invalid treasury account")]
    InvalidTreasuryAccount,
    
    #[error("Unauthorized signer")]
    UnauthorizedSigner,
    
    #[error("Insufficient signers")]
    InsufficientSigners,
    
    #[error("Invalid signature threshold")]
    InvalidSignatureThreshold,
    
    #[error("Treasury not initialized")]
    TreasuryNotInitialized,
    
    #[error("Token mint not initialized")]
    TokenMintNotInitialized,
    
    #[error("Reserve ratio below minimum")]
    ReserveRatioBelowMinimum,
    
    #[error("Payout already processed this week")]
    PayoutAlreadyProcessed,
    
    #[error("Emergency pause active")]
    EmergencyPauseActive,
    
    #[error("Not paused")]
    NotPaused,
    
    #[error("Invalid USDC amount")]
    InvalidUsdcAmount,
    
    #[error("USDC reserve insufficient")]
    UsdcReserveInsufficient,
    
    #[error("Conversion rate out of bounds")]
    ConversionRateOutOfBounds,
    
    #[error("Weekly payout window not active")]
    WeeklyPayoutWindowNotActive,
    
    #[error("Invalid payout percentage")]
    InvalidPayoutPercentage,
    
    #[error("Compliance check failed")]
    ComplianceCheckFailed,
    
    #[error("Account already initialized")]
    AccountAlreadyInitialized,
    
    #[error("Numerical overflow")]
    NumericalOverflow,
}

impl From<EceTokenError> for ProgramError {
    fn from(e: EceTokenError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
