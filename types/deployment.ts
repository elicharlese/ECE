export interface Deployment {
  id: string
  version: string
  timestamp: string
  status: "success" | "failed" | "in-progress" | "rolled-back"
  environment: "production" | "staging" | "development"
  commitHash: string
  author: string
  changes: string[]
  rollbackAvailable: boolean
  isCanary?: boolean
  canaryPercentage?: number
  canaryMetrics?: CanaryMetrics
}

export interface CanaryMetrics {
  errorRate: number
  latency: number
  trafficPercentage: number
  startTime: string
  status: "healthy" | "degraded" | "failed" | "monitoring"
  autoPromoteThreshold?: number
}

export interface RollbackResponse {
  success: boolean
  message: string
  newActiveDeployment?: Deployment
}

export interface DeploymentStats {
  totalDeployments: number
  successfulDeployments: number
  failedDeployments: number
  averageDeploymentTime: number
  rollbackCount: number
  canaryDeployments?: number
  canaryPromotions?: number
  canaryRollbacks?: number
  autoRollbacks?: number
}

export interface CanaryConfig {
  enabled: boolean
  initialPercentage: number
  incrementStep: number
  incrementInterval: number // in minutes
  maxPercentage: number
  autoPromote: boolean
  autoPromoteThreshold: number
  metrics: {
    errorRateThreshold: number
    latencyThreshold: number
  }
}

export interface CanaryDeploymentResponse {
  success: boolean
  message: string
  deployment?: Deployment
}

// Add these new interfaces for deployment comparison

export interface DeploymentComparison {
  baseDeployment: Deployment
  targetDeployment: Deployment
  changes: DeploymentChange[]
  addedFiles: string[]
  modifiedFiles: string[]
  removedFiles: string[]
  performanceImpact: PerformanceImpact
}

export interface DeploymentChange {
  type: "added" | "modified" | "removed"
  path: string
  additions?: number
  deletions?: number
  diffUrl?: string
}

export interface PerformanceImpact {
  loadTimeChange: number // in milliseconds, positive is slower, negative is faster
  memoryUsageChange: number // in MB, positive is more, negative is less
  cpuUsageChange: number // percentage points, positive is more, negative is less
  networkRequestsChange: number // count, positive is more, negative is less
}

// New interfaces for automatic rollbacks

export interface AutoRollbackConfig {
  enabled: boolean
  metrics: {
    errorRateThreshold: number
    latencyThreshold: number
    cpuUsageThreshold: number
    memoryUsageThreshold: number
    useCustomThresholds: boolean
  }
  timing: {
    monitoringPeriod: number // in minutes
    gracePeriod: number // in minutes
    requireConsecutiveFailures: boolean
    consecutiveFailuresCount: number
  }
  notifications: {
    notifyBeforeRollback: boolean
    warningPeriod: number // in seconds
    allowManualOverride: boolean
    notifyChannels: {
      slack: boolean
      email: boolean
    }
  }
}

export interface AutoRollback {
  id: string
  deploymentId: string
  deploymentVersion: string
  targetVersion: string
  timestamp: string
  status: "pending" | "in-progress" | "completed" | "failed" | "cancelled"
  trigger: "error-rate" | "latency" | "cpu-usage" | "memory-usage" | "manual-override"
  environment: string
  duration?: number // in seconds
  metrics: {
    errorRate?: number
    latency?: number
    cpuUsage?: number
    memoryUsage?: number
  }
  thresholds: {
    errorRate: number
    latency: number
    cpuUsage: number
    memoryUsage: number
  }
  logs?: {
    timestamp: string
    level: "info" | "warning" | "error"
    message: string
  }[]
  failureReason?: string
}

export interface DeploymentMonitoringData {
  deploymentId: string
  deploymentVersion: string
  deploymentTime: string
  environment: string
  monitoringDuration: number // in seconds
  metrics: {
    errorRate: number
    latency: number
    cpuUsage: number
    memoryUsage: number
  }
  thresholds: {
    errorRate: number
    latency: number
    cpuUsage: number
    memoryUsage: number
  }
  warningThresholdBreached: boolean
  criticalThresholdBreached: boolean
  pendingRollback: boolean
  rollbackCountdown?: number // in seconds
  rollbackReason?: string
  events: {
    timestamp: string
    type: "info" | "warning" | "error"
    message: string
  }[]
}

export interface CancelRollbackResponse {
  success: boolean
  message: string
}
