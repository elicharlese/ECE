"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type {
  Deployment,
  DeploymentStats,
  RollbackResponse,
  CanaryConfig,
  CanaryDeploymentResponse,
  DeploymentComparison,
  AutoRollbackConfig,
  AutoRollback,
  DeploymentMonitoringData,
  CancelRollbackResponse,
} from "@/types/deployment"
import { deploymentService } from "@/services/deployment-service"
import { useToast } from "@/components/ui/use-toast"

interface DeploymentContextType {
  deployments: Deployment[]
  isLoading: boolean
  error: string | null
  stats: DeploymentStats | null
  selectedEnvironment: string
  setSelectedEnvironment: (env: string) => void
  refreshDeployments: () => Promise<void>
  rollbackToDeployment: (deploymentId: string) => Promise<RollbackResponse>
  canaryConfig: CanaryConfig | null
  updateCanaryConfig: (config: CanaryConfig) => Promise<boolean>
  createCanaryDeployment: (version: string, initialPercentage?: number) => Promise<CanaryDeploymentResponse>
  promoteCanaryDeployment: (deploymentId: string) => Promise<CanaryDeploymentResponse>
  updateCanaryPercentage: (deploymentId: string, percentage: number) => Promise<CanaryDeploymentResponse>
  canaryDeployments: Deployment[]
  isCanaryConfigLoading: boolean
  compareDeployments: (baseId: string, targetId: string) => Promise<DeploymentComparison>
  isComparing: boolean
  // Auto rollback related
  autoRollbackConfig: AutoRollbackConfig | null
  isAutoRollbackConfigLoading: boolean
  updateAutoRollbackConfig: (config: AutoRollbackConfig) => Promise<boolean>
  autoRollbackHistory: AutoRollback[]
  refreshAutoRollbackHistory: () => Promise<void>
  activeDeployments: Deployment[]
  monitoringData: DeploymentMonitoringData[]
  refreshMonitoringData: () => Promise<void>
  cancelAutoRollback: (deploymentId: string) => Promise<CancelRollbackResponse>
}

const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined)

export function DeploymentProvider({ children }: { children: ReactNode }) {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DeploymentStats | null>(null)
  const [selectedEnvironment, setSelectedEnvironment] = useState("production")
  const [canaryConfig, setCanaryConfig] = useState<CanaryConfig | null>(null)
  const [isCanaryConfigLoading, setIsCanaryConfigLoading] = useState(true)
  const [isComparing, setIsComparing] = useState(false)
  const [autoRollbackConfig, setAutoRollbackConfig] = useState<AutoRollbackConfig | null>(null)
  const [isAutoRollbackConfigLoading, setIsAutoRollbackConfigLoading] = useState(true)
  const [autoRollbackHistory, setAutoRollbackHistory] = useState<AutoRollback[]>([])
  const [activeDeployments, setActiveDeployments] = useState<Deployment[]>([])
  const [monitoringData, setMonitoringData] = useState<DeploymentMonitoringData[]>([])
  const { toast } = useToast()

  const fetchDeployments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await deploymentService.getDeployments(selectedEnvironment)
      setDeployments(data)
    } catch (err) {
      setError("Failed to fetch deployments")
      toast({
        title: "Error",
        description: "Failed to fetch deployment history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await deploymentService.getDeploymentStats()
      setStats(data)
    } catch (err) {
      console.error("Failed to fetch deployment stats", err)
    }
  }

  const fetchCanaryConfig = async () => {
    try {
      setIsCanaryConfigLoading(true)
      const config = await deploymentService.getCanaryConfig()
      setCanaryConfig(config)
    } catch (err) {
      console.error("Failed to fetch canary config", err)
      toast({
        title: "Error",
        description: "Failed to fetch canary deployment configuration",
        variant: "destructive",
      })
    } finally {
      setIsCanaryConfigLoading(false)
    }
  }

  const fetchAutoRollbackConfig = async () => {
    try {
      setIsAutoRollbackConfigLoading(true)
      const config = await deploymentService.getAutoRollbackConfig()
      setAutoRollbackConfig(config)
    } catch (err) {
      console.error("Failed to fetch auto rollback config", err)
      toast({
        title: "Error",
        description: "Failed to fetch automatic rollback configuration",
        variant: "destructive",
      })
    } finally {
      setIsAutoRollbackConfigLoading(false)
    }
  }

  const fetchAutoRollbackHistory = async () => {
    try {
      setIsLoading(true)
      const history = await deploymentService.getAutoRollbackHistory()
      setAutoRollbackHistory(history)
    } catch (err) {
      console.error("Failed to fetch auto rollback history", err)
      toast({
        title: "Error",
        description: "Failed to fetch automatic rollback history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchActiveDeployments = async () => {
    try {
      const active = await deploymentService.getActiveDeployments()
      setActiveDeployments(active)
    } catch (err) {
      console.error("Failed to fetch active deployments", err)
    }
  }

  const fetchMonitoringData = async () => {
    try {
      setIsLoading(true)
      const data = await deploymentService.getDeploymentMonitoringData()
      setMonitoringData(data)
    } catch (err) {
      console.error("Failed to fetch monitoring data", err)
      toast({
        title: "Error",
        description: "Failed to fetch deployment monitoring data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDeployments()
    fetchStats()
    fetchCanaryConfig()
    fetchAutoRollbackConfig()
    fetchAutoRollbackHistory()
    fetchActiveDeployments()
    fetchMonitoringData()
  }, [selectedEnvironment])

  const refreshDeployments = async () => {
    await fetchDeployments()
    await fetchStats()
  }

  const refreshAutoRollbackHistory = async () => {
    await fetchAutoRollbackHistory()
  }

  const refreshMonitoringData = async () => {
    await fetchMonitoringData()
    await fetchActiveDeployments()
  }

  const rollbackToDeployment = async (deploymentId: string): Promise<RollbackResponse> => {
    try {
      setIsLoading(true)
      const response = await deploymentService.rollbackToDeployment(deploymentId)

      if (response.success) {
        toast({
          title: "Rollback Successful",
          description: response.message,
        })
        await refreshDeployments()
      } else {
        toast({
          title: "Rollback Failed",
          description: response.message,
          variant: "destructive",
        })
      }

      return response
    } catch (err) {
      const errorMessage = "Failed to rollback deployment"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateCanaryConfig = async (config: CanaryConfig): Promise<boolean> => {
    try {
      setIsCanaryConfigLoading(true)
      const response = await deploymentService.updateCanaryConfig(config)

      if (response.success) {
        setCanaryConfig(config)
        toast({
          title: "Configuration Updated",
          description: "Canary deployment configuration updated successfully",
        })
        return true
      } else {
        toast({
          title: "Update Failed",
          description: response.message,
          variant: "destructive",
        })
        return false
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update canary deployment configuration",
        variant: "destructive",
      })
      return false
    } finally {
      setIsCanaryConfigLoading(false)
    }
  }

  const updateAutoRollbackConfig = async (config: AutoRollbackConfig): Promise<boolean> => {
    try {
      setIsAutoRollbackConfigLoading(true)
      const response = await deploymentService.updateAutoRollbackConfig(config)

      if (response.success) {
        setAutoRollbackConfig(config)
        toast({
          title: "Configuration Updated",
          description: "Automatic rollback configuration updated successfully",
        })
        return true
      } else {
        toast({
          title: "Update Failed",
          description: response.message,
          variant: "destructive",
        })
        return false
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update automatic rollback configuration",
        variant: "destructive",
      })
      return false
    } finally {
      setIsAutoRollbackConfigLoading(false)
    }
  }

  const createCanaryDeployment = async (
    version: string,
    initialPercentage?: number,
  ): Promise<CanaryDeploymentResponse> => {
    try {
      setIsLoading(true)
      const response = await deploymentService.createCanaryDeployment(version, initialPercentage)

      if (response.success) {
        toast({
          title: "Canary Deployment Created",
          description: response.message,
        })
        await refreshDeployments()
      } else {
        toast({
          title: "Creation Failed",
          description: response.message,
          variant: "destructive",
        })
      }

      return response
    } catch (err) {
      const errorMessage = "Failed to create canary deployment"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const promoteCanaryDeployment = async (deploymentId: string): Promise<CanaryDeploymentResponse> => {
    try {
      setIsLoading(true)
      const response = await deploymentService.promoteCanaryDeployment(deploymentId)

      if (response.success) {
        toast({
          title: "Canary Promoted",
          description: response.message,
        })
        await refreshDeployments()
      } else {
        toast({
          title: "Promotion Failed",
          description: response.message,
          variant: "destructive",
        })
      }

      return response
    } catch (err) {
      const errorMessage = "Failed to promote canary deployment"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateCanaryPercentage = async (
    deploymentId: string,
    percentage: number,
  ): Promise<CanaryDeploymentResponse> => {
    try {
      setIsLoading(true)
      const response = await deploymentService.updateCanaryPercentage(deploymentId, percentage)

      if (response.success) {
        toast({
          title: "Traffic Updated",
          description: response.message,
        })
        await refreshDeployments()
      } else {
        toast({
          title: "Update Failed",
          description: response.message,
          variant: "destructive",
        })
      }

      return response
    } catch (err) {
      const errorMessage = "Failed to update canary traffic percentage"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const cancelAutoRollback = async (deploymentId: string): Promise<CancelRollbackResponse> => {
    try {
      setIsLoading(true)
      const response = await deploymentService.cancelAutoRollback(deploymentId)

      if (response.success) {
        toast({
          title: "Rollback Cancelled",
          description: "Automatic rollback has been cancelled",
        })
        await refreshMonitoringData()
      } else {
        toast({
          title: "Cancellation Failed",
          description: response.message,
          variant: "destructive",
        })
      }

      return response
    } catch (err) {
      const errorMessage = "Failed to cancel automatic rollback"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Filter canary deployments
  const canaryDeployments = deployments.filter((d) => d.isCanary)

  const compareDeployments = async (baseId: string, targetId: string): Promise<DeploymentComparison> => {
    try {
      setIsComparing(true)
      const comparison = await deploymentService.compareDeployments(baseId, targetId)
      return comparison
    } catch (err) {
      const errorMessage = "Failed to compare deployments"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsComparing(false)
    }
  }

  return (
    <DeploymentContext.Provider
      value={{
        deployments,
        isLoading,
        error,
        stats,
        selectedEnvironment,
        setSelectedEnvironment,
        refreshDeployments,
        rollbackToDeployment,
        canaryConfig,
        updateCanaryConfig,
        createCanaryDeployment,
        promoteCanaryDeployment,
        updateCanaryPercentage,
        canaryDeployments,
        isCanaryConfigLoading,
        compareDeployments,
        isComparing,
        autoRollbackConfig,
        isAutoRollbackConfigLoading,
        updateAutoRollbackConfig,
        autoRollbackHistory,
        refreshAutoRollbackHistory,
        activeDeployments,
        monitoringData,
        refreshMonitoringData,
        cancelAutoRollback,
      }}
    >
      {children}
    </DeploymentContext.Provider>
  )
}

export function useDeployments() {
  const context = useContext(DeploymentContext)
  if (context === undefined) {
    throw new Error("useDeployments must be used within a DeploymentProvider")
  }
  return context
}
