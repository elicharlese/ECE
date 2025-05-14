import type {
  Deployment,
  RollbackResponse,
  CanaryConfig,
  CanaryDeploymentResponse,
  DeploymentComparison,
  AutoRollbackConfig,
  AutoRollback,
  DeploymentMonitoringData,
  CancelRollbackResponse,
} from "@/types/deployment"

// This would typically interact with your backend API
export const deploymentService = {
  async getDeployments(environment = "all", limit = 10, includeCanary = true): Promise<Deployment[]> {
    // In a real implementation, this would be an API call
    console.log(`Fetching deployments for ${environment} environment, limit: ${limit}, includeCanary: ${includeCanary}`)

    // Filter by environment if specified
    let filteredDeployments = mockDeployments
    if (environment !== "all") {
      filteredDeployments = mockDeployments.filter((d) => d.environment === environment)
    }

    // Filter out canary deployments if not requested
    if (!includeCanary) {
      filteredDeployments = filteredDeployments.filter((d) => !d.isCanary)
    }

    return filteredDeployments.slice(0, limit)
  },

  async rollbackToDeployment(deploymentId: string): Promise<RollbackResponse> {
    // In a real implementation, this would be an API call
    console.log(`Rolling back to deployment: ${deploymentId}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const targetDeployment = mockDeployments.find((d) => d.id === deploymentId)

    if (!targetDeployment) {
      return {
        success: false,
        message: "Deployment not found",
      }
    }

    if (!targetDeployment.rollbackAvailable) {
      return {
        success: false,
        message: "Rollback not available for this deployment",
      }
    }

    // In a real implementation, this would trigger the actual rollback process
    // and also create a notification

    // Create a notification for the rollback (in a real app, this would be done by the backend)
    this.createNotification({
      type: "rollbackInitiated",
      title: "Rollback Initiated",
      message: `Rollback initiated to version ${targetDeployment.version}`,
      deploymentId: targetDeployment.id,
      version: targetDeployment.version,
      environment: targetDeployment.environment,
    })

    return {
      success: true,
      message: `Successfully rolled back to version ${targetDeployment.version}`,
      newActiveDeployment: {
        ...targetDeployment,
        status: "success",
        timestamp: new Date().toISOString(),
      },
    }
  },

  async getDeploymentStats(): Promise<any> {
    // In a real implementation, this would be an API call
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      totalDeployments: mockDeployments.length,
      successfulDeployments: mockDeployments.filter((d) => d.status === "success").length,
      failedDeployments: mockDeployments.filter((d) => d.status === "failed").length,
      averageDeploymentTime: 245, // seconds
      rollbackCount: 3,
      canaryDeployments: mockDeployments.filter((d) => d.isCanary).length,
      canaryPromotions: 2,
      canaryRollbacks: 1,
      autoRollbacks: mockAutoRollbackHistory.filter((r) => r.status === "completed").length,
    }
  },

  async getCanaryConfig(): Promise<CanaryConfig> {
    // In a real implementation, this would be an API call
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    return mockCanaryConfig
  },

  async updateCanaryConfig(config: CanaryConfig): Promise<{ success: boolean; message: string }> {
    // In a real implementation, this would be an API call
    console.log("Updating canary config:", config)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update the mock config
    mockCanaryConfig = { ...config }

    return {
      success: true,
      message: "Canary deployment configuration updated successfully",
    }
  },

  async createCanaryDeployment(version: string, initialPercentage?: number): Promise<CanaryDeploymentResponse> {
    // In a real implementation, this would be an API call
    console.log(`Creating canary deployment for version ${version} with initial percentage ${initialPercentage}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const percentage = initialPercentage || mockCanaryConfig.initialPercentage

    const newDeployment: Deployment = {
      id: `dep-canary-${Date.now()}`,
      version,
      timestamp: new Date().toISOString(),
      status: "in-progress",
      environment: "production",
      commitHash: "a1b2c3d",
      author: "Canary System",
      changes: ["Canary deployment of version " + version],
      rollbackAvailable: true,
      isCanary: true,
      canaryPercentage: percentage,
      canaryMetrics: {
        errorRate: 0.1,
        latency: 120,
        trafficPercentage: percentage,
        startTime: new Date().toISOString(),
        status: "monitoring",
        autoPromoteThreshold: mockCanaryConfig.autoPromoteThreshold,
      },
    }

    // In a real implementation, this would create the actual canary deployment
    // For now, we'll just add it to our mock data
    mockDeployments.unshift(newDeployment)

    // Create a notification for the canary deployment
    this.createNotification({
      type: "canaryDeploymentCreated",
      title: "Canary Deployment Created",
      message: `Canary deployment for version ${version} created with ${percentage}% traffic`,
      deploymentId: newDeployment.id,
      version: newDeployment.version,
      environment: newDeployment.environment,
    })

    return {
      success: true,
      message: `Successfully created canary deployment for version ${version} with ${percentage}% traffic`,
      deployment: newDeployment,
    }
  },

  async promoteCanaryDeployment(deploymentId: string): Promise<CanaryDeploymentResponse> {
    // In a real implementation, this would be an API call
    console.log(`Promoting canary deployment: ${deploymentId}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const canaryDeployment = mockDeployments.find((d) => d.id === deploymentId && d.isCanary)

    if (!canaryDeployment) {
      return {
        success: false,
        message: "Canary deployment not found",
      }
    }

    // Update the canary deployment to be a full deployment
    const updatedDeployment: Deployment = {
      ...canaryDeployment,
      isCanary: false,
      status: "success",
      canaryPercentage: 100,
      canaryMetrics: {
        ...canaryDeployment.canaryMetrics!,
        trafficPercentage: 100,
        status: "healthy",
      },
    }

    // In a real implementation, this would promote the actual canary deployment
    // For now, we'll just update our mock data
    const index = mockDeployments.findIndex((d) => d.id === deploymentId)
    if (index !== -1) {
      mockDeployments[index] = updatedDeployment
    }

    // Create a notification for the promotion
    this.createNotification({
      type: "canaryDeploymentPromoted",
      title: "Canary Deployment Promoted",
      message: `Canary deployment for version ${updatedDeployment.version} promoted to 100% traffic`,
      deploymentId: updatedDeployment.id,
      version: updatedDeployment.version,
      environment: updatedDeployment.environment,
    })

    return {
      success: true,
      message: `Successfully promoted canary deployment ${canaryDeployment.version} to full deployment`,
      deployment: updatedDeployment,
    }
  },

  async updateCanaryPercentage(deploymentId: string, percentage: number): Promise<CanaryDeploymentResponse> {
    // In a real implementation, this would be an API call
    console.log(`Updating canary deployment ${deploymentId} to ${percentage}% traffic`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const canaryDeployment = mockDeployments.find((d) => d.id === deploymentId && d.isCanary)

    if (!canaryDeployment) {
      return {
        success: false,
        message: "Canary deployment not found",
      }
    }

    // Update the canary deployment percentage
    const updatedDeployment: Deployment = {
      ...canaryDeployment,
      canaryPercentage: percentage,
      canaryMetrics: {
        ...canaryDeployment.canaryMetrics!,
        trafficPercentage: percentage,
      },
    }

    // In a real implementation, this would update the actual canary deployment
    // For now, we'll just update our mock data
    const index = mockDeployments.findIndex((d) => d.id === deploymentId)
    if (index !== -1) {
      mockDeployments[index] = updatedDeployment
    }

    return {
      success: true,
      message: `Successfully updated canary deployment traffic to ${percentage}%`,
      deployment: updatedDeployment,
    }
  },

  async compareDeployments(baseId: string, targetId: string): Promise<DeploymentComparison> {
    // In a real implementation, this would be an API call
    console.log(`Comparing deployments: ${baseId} and ${targetId}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const baseDeployment = mockDeployments.find((d) => d.id === baseId)
    const targetDeployment = mockDeployments.find((d) => d.id === targetId)

    if (!baseDeployment || !targetDeployment) {
      throw new Error("One or both deployments not found")
    }

    // Generate mock comparison data
    return {
      baseDeployment,
      targetDeployment,
      changes: [
        {
          type: "added",
          path: "src/components/new-feature.tsx",
          additions: 120,
          deletions: 0,
          diffUrl: "#",
        },
        {
          type: "modified",
          path: "src/pages/index.tsx",
          additions: 25,
          deletions: 15,
          diffUrl: "#",
        },
        {
          type: "modified",
          path: "src/lib/utils.ts",
          additions: 8,
          deletions: 3,
          diffUrl: "#",
        },
        {
          type: "removed",
          path: "src/components/deprecated-component.tsx",
          additions: 0,
          deletions: 85,
          diffUrl: "#",
        },
      ],
      addedFiles: ["src/components/new-feature.tsx", "src/styles/new-feature.css"],
      modifiedFiles: ["src/pages/index.tsx", "src/lib/utils.ts", "src/styles/global.css"],
      removedFiles: ["src/components/deprecated-component.tsx"],
      performanceImpact: {
        loadTimeChange: -120, // 120ms faster
        memoryUsageChange: 2.5, // 2.5MB more memory usage
        cpuUsageChange: -1.2, // 1.2 percentage points less CPU usage
        networkRequestsChange: 1, // 1 more network request
      },
    }
  },

  // New method to create notifications (in a real app, this would be handled by the backend)
  async createNotification(notification: {
    type: string
    title: string
    message: string
    deploymentId?: string
    version?: string
    environment?: string
    metadata?: Record<string, any>
  }) {
    // In a real implementation, this would create a notification in the database
    // and potentially trigger other notification channels (email, Slack, etc.)
    console.log("Creating notification:", notification)

    // This is just for demo purposes - in a real app, the backend would handle this
    // and the frontend would receive notifications via WebSockets or polling

    // For now, we'll just log it
    return {
      success: true,
      message: "Notification created",
    }
  },

  // New method to send notifications via different channels
  async sendNotification(notificationId: string, channels: string[]) {
    // In a real implementation, this would send the notification via the specified channels
    console.log(`Sending notification ${notificationId} via channels:`, channels)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      success: true,
      message: `Notification sent via ${channels.join(", ")}`,
    }
  },

  // Auto rollback related methods
  async getAutoRollbackConfig(): Promise<AutoRollbackConfig> {
    // In a real implementation, this would be an API call
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    return mockAutoRollbackConfig
  },

  async updateAutoRollbackConfig(config: AutoRollbackConfig): Promise<{ success: boolean; message: string }> {
    // In a real implementation, this would be an API call
    console.log("Updating auto rollback config:", config)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update the mock config
    mockAutoRollbackConfig = { ...config }

    return {
      success: true,
      message: "Automatic rollback configuration updated successfully",
    }
  },

  async getAutoRollbackHistory(): Promise<AutoRollback[]> {
    // In a real implementation, this would be an API call
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return mockAutoRollbackHistory
  },

  async getActiveDeployments(): Promise<Deployment[]> {
    // In a real implementation, this would be an API call
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return deployments that are in-progress or recently successful
    return mockDeployments.filter(
      (d) =>
        d.status === "in-progress" ||
        (d.status === "success" && new Date(d.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)),
    )
  },

  async getDeploymentMonitoringData(): Promise<DeploymentMonitoringData[]> {
    // In a real implementation, this would be an API call
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    return mockMonitoringData
  },

  async cancelAutoRollback(deploymentId: string): Promise<CancelRollbackResponse> {
    // In a real implementation, this would be an API call
    console.log(`Cancelling automatic rollback for deployment: ${deploymentId}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find the deployment in monitoring data
    const monitoringDataIndex = mockMonitoringData.findIndex(
      (data) => data.deploymentId === deploymentId && data.pendingRollback,
    )

    if (monitoringDataIndex === -1) {
      return {
        success: false,
        message: "No pending rollback found for this deployment",
      }
    }

    // Update the monitoring data to cancel the rollback
    mockMonitoringData[monitoringDataIndex] = {
      ...mockMonitoringData[monitoringDataIndex],
      pendingRollback: false,
      rollbackCountdown: undefined,
      rollbackReason: undefined,
    }

    // Create a notification for the cancellation
    this.createNotification({
      type: "rollbackCancelled",
      title: "Automatic Rollback Cancelled",
      message: `Automatic rollback for deployment ${mockMonitoringData[monitoringDataIndex].deploymentVersion} has been cancelled`,
      deploymentId: deploymentId,
      version: mockMonitoringData[monitoringDataIndex].deploymentVersion,
      environment: mockMonitoringData[monitoringDataIndex].environment,
    })

    // Add a cancellation entry to the rollback history
    const newRollback: AutoRollback = {
      id: `auto-rollback-${Date.now()}`,
      deploymentId: deploymentId,
      deploymentVersion: mockMonitoringData[monitoringDataIndex].deploymentVersion,
      targetVersion: mockDeployments.find((d) => d.status === "success" && !d.isCanary)?.version || "unknown",
      timestamp: new Date().toISOString(),
      status: "cancelled",
      trigger: (mockMonitoringData[monitoringDataIndex].rollbackReason as any) || "manual-override",
      environment: mockMonitoringData[monitoringDataIndex].environment,
      metrics: mockMonitoringData[monitoringDataIndex].metrics,
      thresholds: mockMonitoringData[monitoringDataIndex].thresholds,
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: "info",
          message: "Automatic rollback cancelled by user",
        },
      ],
    }

    mockAutoRollbackHistory.unshift(newRollback)

    return {
      success: true,
      message: "Automatic rollback cancelled successfully",
    }
  },
}

// Mock data for demonstration
const mockDeployments: Deployment[] = [
  {
    id: "dep-canary-001",
    version: "v1.3.0-canary",
    timestamp: "2023-05-08T09:15:00Z",
    status: "in-progress",
    environment: "production",
    commitHash: "7e9d2f1",
    author: "Canary System",
    changes: ["New dashboard UI", "Performance improvements for analytics"],
    rollbackAvailable: true,
    isCanary: true,
    canaryPercentage: 25,
    canaryMetrics: {
      errorRate: 0.5,
      latency: 145,
      trafficPercentage: 25,
      startTime: "2023-05-08T09:15:00Z",
      status: "monitoring",
      autoPromoteThreshold: 75,
    },
  },
  {
    id: "dep-001",
    version: "v1.2.5",
    timestamp: "2023-05-06T14:30:00Z",
    status: "success",
    environment: "production",
    commitHash: "8f4d76a",
    author: "Sarah Chen",
    changes: ["Fixed payment processing bug", "Updated UI components"],
    rollbackAvailable: true,
  },
  {
    id: "dep-002",
    version: "v1.2.4",
    timestamp: "2023-05-04T10:15:00Z",
    status: "success",
    environment: "production",
    commitHash: "3e5c12b",
    author: "Mike Johnson",
    changes: ["Added new marketplace features", "Performance improvements"],
    rollbackAvailable: true,
  },
  {
    id: "dep-003",
    version: "v1.2.3",
    timestamp: "2023-05-01T09:45:00Z",
    status: "rolled-back",
    environment: "production",
    commitHash: "2b1d9e7",
    author: "Alex Wong",
    changes: ["Smart contract integration", "New wallet features"],
    rollbackAvailable: false,
  },
  {
    id: "dep-004",
    version: "v1.2.2",
    timestamp: "2023-04-28T16:20:00Z",
    status: "success",
    environment: "production",
    commitHash: "5a7d3f9",
    author: "Emma Davis",
    changes: ["Security patches", "UI/UX improvements"],
    rollbackAvailable: true,
  },
  {
    id: "dep-005",
    version: "v1.2.1",
    timestamp: "2023-04-25T11:30:00Z",
    status: "failed",
    environment: "production",
    commitHash: "9c4b2e1",
    author: "James Wilson",
    changes: ["Database migration", "API endpoint updates"],
    rollbackAvailable: false,
  },
]

// Mock canary configuration
let mockCanaryConfig: CanaryConfig = {
  enabled: true,
  initialPercentage: 10,
  incrementStep: 15,
  incrementInterval: 30, // minutes
  maxPercentage: 50,
  autoPromote: true,
  autoPromoteThreshold: 75, // percentage of health metrics that must be good
  metrics: {
    errorRateThreshold: 1.0, // percentage
    latencyThreshold: 200, // milliseconds
  },
}

// Mock auto rollback configuration
let mockAutoRollbackConfig: AutoRollbackConfig = {
  enabled: true,
  metrics: {
    errorRateThreshold: 2.0, // percentage
    latencyThreshold: 300, // milliseconds
    cpuUsageThreshold: 80, // percentage
    memoryUsageThreshold: 85, // percentage
    useCustomThresholds: false,
  },
  timing: {
    monitoringPeriod: 15, // minutes
    gracePeriod: 5, // minutes
    requireConsecutiveFailures: true,
    consecutiveFailuresCount: 3,
  },
  notifications: {
    notifyBeforeRollback: true,
    warningPeriod: 60, // seconds
    allowManualOverride: true,
    notifyChannels: {
      slack: true,
      email: true,
    },
  },
}

// Mock auto rollback history
const mockAutoRollbackHistory: AutoRollback[] = [
  {
    id: "auto-rollback-001",
    deploymentId: "dep-006",
    deploymentVersion: "v1.3.1",
    targetVersion: "v1.2.5",
    timestamp: "2023-05-10T08:30:00Z",
    status: "completed",
    trigger: "error-rate",
    environment: "production",
    duration: 45, // seconds
    metrics: {
      errorRate: 3.5,
      latency: 280,
      cpuUsage: 75,
      memoryUsage: 82,
    },
    thresholds: {
      errorRate: 2.0,
      latency: 300,
      cpuUsage: 80,
      memoryUsage: 85,
    },
    logs: [
      {
        timestamp: "2023-05-10T08:29:15Z",
        level: "warning",
        message: "Error rate threshold exceeded: 3.5% > 2.0%",
      },
      {
        timestamp: "2023-05-10T08:29:30Z",
        level: "warning",
        message: "Initiating automatic rollback due to high error rate",
      },
      {
        timestamp: "2023-05-10T08:30:00Z",
        level: "info",
        message: "Rollback to v1.2.5 completed successfully",
      },
    ],
  },
  {
    id: "auto-rollback-002",
    deploymentId: "dep-007",
    deploymentVersion: "v1.3.2",
    targetVersion: "v1.2.5",
    timestamp: "2023-05-12T14:45:00Z",
    status: "failed",
    trigger: "latency",
    environment: "production",
    duration: 60, // seconds
    metrics: {
      errorRate: 1.2,
      latency: 450,
      cpuUsage: 65,
      memoryUsage: 70,
    },
    thresholds: {
      errorRate: 2.0,
      latency: 300,
      cpuUsage: 80,
      memoryUsage: 85,
    },
    logs: [
      {
        timestamp: "2023-05-12T14:44:15Z",
        level: "warning",
        message: "Latency threshold exceeded: 450ms > 300ms",
      },
      {
        timestamp: "2023-05-12T14:44:30Z",
        level: "warning",
        message: "Initiating automatic rollback due to high latency",
      },
      {
        timestamp: "2023-05-12T14:45:00Z",
        level: "error",
        message: "Rollback to v1.2.5 failed: Database connection error",
      },
    ],
    failureReason: "Database connection error during rollback process",
  },
  {
    id: "auto-rollback-003",
    deploymentId: "dep-008",
    deploymentVersion: "v1.3.3",
    targetVersion: "v1.2.5",
    timestamp: "2023-05-15T10:15:00Z",
    status: "cancelled",
    trigger: "cpu-usage",
    environment: "production",
    metrics: {
      errorRate: 0.8,
      latency: 250,
      cpuUsage: 88,
      memoryUsage: 75,
    },
    thresholds: {
      errorRate: 2.0,
      latency: 300,
      cpuUsage: 80,
      memoryUsage: 85,
    },
    logs: [
      {
        timestamp: "2023-05-15T10:14:15Z",
        level: "warning",
        message: "CPU usage threshold exceeded: 88% > 80%",
      },
      {
        timestamp: "2023-05-15T10:14:30Z",
        level: "warning",
        message: "Initiating automatic rollback due to high CPU usage",
      },
      {
        timestamp: "2023-05-15T10:14:45Z",
        level: "info",
        message: "Automatic rollback cancelled by user",
      },
    ],
  },
]

// Mock monitoring data
const mockMonitoringData: DeploymentMonitoringData[] = [
  {
    deploymentId: "dep-001",
    deploymentVersion: "v1.2.5",
    deploymentTime: "2023-05-06T14:30:00Z",
    environment: "production",
    monitoringDuration: 3600, // seconds
    metrics: {
      errorRate: 0.2,
      latency: 120,
      cpuUsage: 45,
      memoryUsage: 60,
    },
    thresholds: {
      errorRate: 2.0,
      latency: 300,
      cpuUsage: 80,
      memoryUsage: 85,
    },
    warningThresholdBreached: false,
    criticalThresholdBreached: false,
    pendingRollback: false,
    events: [
      {
        timestamp: "2023-05-06T14:35:00Z",
        type: "info",
        message: "Deployment monitoring started",
      },
      {
        timestamp: "2023-05-06T14:40:00Z",
        type: "info",
        message: "All metrics within normal ranges",
      },
      {
        timestamp: "2023-05-06T15:00:00Z",
        type: "info",
        message: "Deployment stable for 30 minutes",
      },
    ],
  },
  {
    deploymentId: "dep-canary-001",
    deploymentVersion: "v1.3.0-canary",
    deploymentTime: "2023-05-08T09:15:00Z",
    environment: "production",
    monitoringDuration: 1800, // seconds
    metrics: {
      errorRate: 1.8,
      latency: 280,
      cpuUsage: 75,
      memoryUsage: 70,
    },
    thresholds: {
      errorRate: 2.0,
      latency: 300,
      cpuUsage: 80,
      memoryUsage: 85,
    },
    warningThresholdBreached: true,
    criticalThresholdBreached: false,
    pendingRollback: false,
    events: [
      {
        timestamp: "2023-05-08T09:20:00Z",
        type: "info",
        message: "Canary deployment monitoring started",
      },
      {
        timestamp: "2023-05-08T09:25:00Z",
        type: "warning",
        message: "Error rate approaching threshold: 1.8% (threshold: 2.0%)",
      },
      {
        timestamp: "2023-05-08T09:30:00Z",
        type: "warning",
        message: "Latency approaching threshold: 280ms (threshold: 300ms)",
      },
    ],
  },
  {
    deploymentId: "dep-009",
    deploymentVersion: "v1.3.4",
    deploymentTime: "2023-05-20T11:00:00Z",
    environment: "production",
    monitoringDuration: 900, // seconds
    metrics: {
      errorRate: 3.5,
      latency: 320,
      cpuUsage: 85,
      memoryUsage: 75,
    },
    thresholds: {
      errorRate: 2.0,
      latency: 300,
      cpuUsage: 80,
      memoryUsage: 85,
    },
    warningThresholdBreached: true,
    criticalThresholdBreached: true,
    pendingRollback: true,
    rollbackCountdown: 45, // seconds
    rollbackReason: "error-rate",
    events: [
      {
        timestamp: "2023-05-20T11:05:00Z",
        type: "info",
        message: "Deployment monitoring started",
      },
      {
        timestamp: "2023-05-20T11:10:00Z",
        type: "warning",
        message: "Error rate threshold exceeded: 3.5% > 2.0%",
      },
      {
        timestamp: "2023-05-20T11:12:00Z",
        type: "warning",
        message: "Latency threshold exceeded: 320ms > 300ms",
      },
      {
        timestamp: "2023-05-20T11:14:00Z",
        type: "warning",
        message: "CPU usage threshold exceeded: 85% > 80%",
      },
      {
        timestamp: "2023-05-20T11:15:00Z",
        type: "error",
        message: "Multiple thresholds exceeded, initiating automatic rollback in 45 seconds",
      },
    ],
  },
]
