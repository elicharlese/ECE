use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

/// Treasury state account that manages ECE token operations
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct TreasuryState {
    /// Whether the treasury is initialized
    pub is_initialized: bool,
    
    /// Multi-signature signers
    pub signers: Vec<Pubkey>,
    
    /// Number of signatures required for operations
    pub threshold: u8,
    
    /// ECE token mint address
    pub ece_mint: Pubkey,
    
    /// USDC token mint address (backing asset)
    pub usdc_mint: Pubkey,
    
    /// Treasury USDC reserve account
    pub usdc_reserve: Pubkey,
    
    /// Total ECE tokens in circulation
    pub ece_circulation: u64,
    
    /// Total USDC in reserves
    pub usdc_reserves: u64,
    
    /// Emergency pause status
    pub is_paused: bool,
    
    /// Emergency authority (can pause/unpause)
    pub emergency_authority: Pubkey,
    
    /// Last weekly payout timestamp
    pub last_payout_timestamp: i64,
    
    /// Weekly payout window (in seconds, default 7 days)
    pub payout_window: i64,
    
    /// Minimum reserve ratio (basis points, 10000 = 100%)
    pub min_reserve_ratio: u16,
    
    /// Company revenue account for weekly payouts
    pub company_revenue_account: Pubkey,
    
    /// Company USDC account for payouts
    pub company_usdc_account: Pubkey,
    
    /// Total revenue processed through weekly payouts
    pub total_revenue_processed: u64,
    
    /// Number of payouts processed
    pub payout_count: u64,
    
    /// Compliance officer authority
    pub compliance_authority: Pubkey,
    
    /// Maximum single transaction amount (for compliance)
    pub max_transaction_amount: u64,
    
    /// Daily transaction volume limit
    pub daily_volume_limit: u64,
    
    /// Current daily volume (resets daily)
    pub current_daily_volume: u64,
    
    /// Last volume reset timestamp
    pub last_volume_reset: i64,
}

impl TreasuryState {
    pub const LEN: usize = 8 + // discriminator
        1 + // is_initialized
        4 + (32 * 5) + // signers (max 5 signers)
        1 + // threshold
        32 + // ece_mint
        32 + // usdc_mint
        32 + // usdc_reserve
        8 + // ece_circulation
        8 + // usdc_reserves
        1 + // is_paused
        32 + // emergency_authority
        8 + // last_payout_timestamp
        8 + // payout_window
        2 + // min_reserve_ratio
        32 + // company_revenue_account
        32 + // company_usdc_account
        8 + // total_revenue_processed
        8 + // payout_count
        32 + // compliance_authority
        8 + // max_transaction_amount
        8 + // daily_volume_limit
        8 + // current_daily_volume
        8; // last_volume_reset
    
    /// Check if the treasury has sufficient reserves for a given ECE amount
    pub fn has_sufficient_reserves(&self, ece_amount: u64) -> bool {
        self.usdc_reserves >= ece_amount
    }
    
    /// Calculate current reserve ratio in basis points
    pub fn reserve_ratio(&self) -> u16 {
        if self.ece_circulation == 0 {
            return 10000; // 100% if no tokens in circulation
        }
        
        let ratio = (self.usdc_reserves as u128 * 10000) / self.ece_circulation as u128;
        ratio.min(10000) as u16
    }
    
    /// Check if reserve ratio is above minimum threshold
    pub fn is_reserve_ratio_healthy(&self) -> bool {
        self.reserve_ratio() >= self.min_reserve_ratio
    }
    
    /// Check if weekly payout window is active
    pub fn is_payout_window_active(&self, current_timestamp: i64) -> bool {
        let time_since_last_payout = current_timestamp - self.last_payout_timestamp;
        time_since_last_payout >= self.payout_window
    }
    
    /// Check if daily volume limit would be exceeded
    pub fn would_exceed_daily_limit(&self, amount: u64, current_timestamp: i64) -> bool {
        // Reset daily volume if it's a new day
        let time_since_reset = current_timestamp - self.last_volume_reset;
        let seconds_per_day = 86400; // 24 * 60 * 60
        
        if time_since_reset >= seconds_per_day {
            // New day, volume resets
            return amount > self.daily_volume_limit;
        }
        
        self.current_daily_volume + amount > self.daily_volume_limit
    }
    
    /// Update daily volume tracking
    pub fn update_daily_volume(&mut self, amount: u64, current_timestamp: i64) {
        let time_since_reset = current_timestamp - self.last_volume_reset;
        let seconds_per_day = 86400;
        
        if time_since_reset >= seconds_per_day {
            // New day, reset volume
            self.current_daily_volume = amount;
            self.last_volume_reset = current_timestamp;
        } else {
            // Same day, add to volume
            self.current_daily_volume += amount;
        }
    }
    
    /// Validate multi-signature requirements
    pub fn validate_signatures(&self, provided_signers: &[Pubkey]) -> bool {
        if provided_signers.len() < self.threshold as usize {
            return false;
        }
        
        let mut valid_signer_count = 0;
        for signer in provided_signers {
            if self.signers.contains(signer) {
                valid_signer_count += 1;
            }
        }
        
        valid_signer_count >= self.threshold
    }
}

/// Weekly payout record for tracking and compliance
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct WeeklyPayoutRecord {
    /// Payout sequence number
    pub payout_id: u64,
    
    /// Timestamp of the payout
    pub timestamp: i64,
    
    /// Total ECE revenue amount processed
    pub revenue_amount: u64,
    
    /// Percentage of revenue converted to USDC
    pub payout_percentage: u8,
    
    /// Amount of ECE burned
    pub ece_burned: u64,
    
    /// Amount of USDC released to company
    pub usdc_released: u64,
    
    /// Transaction signature for audit trail
    pub transaction_signature: String,
    
    /// Compliance check status
    pub compliance_approved: bool,
    
    /// Authorized signers for this payout
    pub authorized_signers: Vec<Pubkey>,
}

impl WeeklyPayoutRecord {
    pub const LEN: usize = 8 + // payout_id
        8 + // timestamp
        8 + // revenue_amount
        1 + // payout_percentage
        8 + // ece_burned
        8 + // usdc_released
        4 + 88 + // transaction_signature (max 88 chars)
        1 + // compliance_approved
        4 + (32 * 5); // authorized_signers (max 5)
}

/// Compliance record for large transactions
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct ComplianceRecord {
    /// Transaction ID
    pub transaction_id: u64,
    
    /// User wallet address
    pub user_wallet: Pubkey,
    
    /// Transaction amount
    pub amount: u64,
    
    /// Transaction type
    pub transaction_type: TransactionType,
    
    /// Timestamp
    pub timestamp: i64,
    
    /// KYC verification status
    pub kyc_verified: bool,
    
    /// AML check status
    pub aml_cleared: bool,
    
    /// Compliance officer approval
    pub compliance_approved: bool,
    
    /// Risk score (0-100)
    pub risk_score: u8,
    
    /// Additional compliance notes
    pub notes: String,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum TransactionType {
    MintTokens,
    BurnTokens,
    DepositUsdc,
    WithdrawUsdc,
    WeeklyPayout,
}

impl ComplianceRecord {
    pub const LEN: usize = 8 + // transaction_id
        32 + // user_wallet
        8 + // amount
        1 + // transaction_type
        8 + // timestamp
        1 + // kyc_verified
        1 + // aml_cleared
        1 + // compliance_approved
        1 + // risk_score
        4 + 256; // notes (max 256 chars)
}

/// Reserve audit record for transparency
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct ReserveAuditRecord {
    /// Audit sequence number
    pub audit_id: u64,
    
    /// Audit timestamp
    pub timestamp: i64,
    
    /// ECE circulation at audit time
    pub ece_circulation: u64,
    
    /// USDC reserves at audit time
    pub usdc_reserves: u64,
    
    /// Reserve ratio in basis points
    pub reserve_ratio: u16,
    
    /// Audit status
    pub audit_status: AuditStatus,
    
    /// Auditor address
    pub auditor: Pubkey,
    
    /// Audit notes
    pub notes: String,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum AuditStatus {
    Passed,
    Failed,
    UnderReview,
}

impl ReserveAuditRecord {
    pub const LEN: usize = 8 + // audit_id
        8 + // timestamp
        8 + // ece_circulation
        8 + // usdc_reserves
        2 + // reserve_ratio
        1 + // audit_status
        32 + // auditor
        4 + 512; // notes (max 512 chars)
}
