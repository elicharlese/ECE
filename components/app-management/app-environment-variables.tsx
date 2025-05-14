"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/hooks/use-toast"
import { useDemo } from "@/lib/demo-context"
import { PlusCircle, Trash2, Eye, EyeOff, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

type EnvVar = {
  id: string
  key: string
  value: string
  isSecret: boolean
  isVisible: boolean
}

export function AppEnvironmentVariables() {
  const { toast } = useToast()
  const { isDemoMode } = useDemo()
  const [isLoading, setIsLoading] = useState(false)
  const [envVars, setEnvVars] = useState<EnvVar[]>([
    { id: "1", key: "API_URL", value: "https://api.example.com", isSecret: false, isVisible: true },
    { id: "2", key: "API_KEY", value: "sk_test_abcdefghijklmnopqrstuvwxyz", isSecret: true, isVisible: false },
    { id: "3", key: "DEBUG", value: "false", isSecret: false, isVisible: true },
  ])

  const addEnvVar = () => {
    const newId = `env_${Date.now()}`
    setEnvVars([...envVars, { id: newId, key: "", value: "", isSecret: false, isVisible: true }])
  }

  const removeEnvVar = (id: string) => {
    setEnvVars(envVars.filter((env) => env.id !== id))
  }

  const updateEnvVar = (id: string, field: keyof EnvVar, value: string | boolean) => {
    setEnvVars(
      envVars.map((env) => {
        if (env.id === id) {
          return { ...env, [field]: value }
        }
        return env
      }),
    )
  }

  const toggleVisibility = (id: string) => {
    setEnvVars(
      envVars.map((env) => {
        if (env.id === id) {
          return { ...env, isVisible: !env.isVisible }
        }
        return env
      }),
    )
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      if (isDemoMode) {
        // Simulate API call for demo mode
        await new Promise((resolve) => setTimeout(resolve, 1500))
      } else {
        // Here you would actually save the env vars to your backend
        // await updateAppEnvVars(appId, envVars)
      }

      toast({
        title: "Environment variables updated",
        description: "Your environment variables have been updated successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Environment variables update error:", error)
      toast({
        title: "Error",
        description: "Failed to update environment variables. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Environment Variables</h3>
        <Button variant="outline" onClick={addEnvVar} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Variable
        </Button>
      </div>

      <Alert variant="default" className="bg-muted/50">
        <AlertDescription>
          Environment variables are encrypted and only exposed to your application at build and runtime.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {envVars.map((env) => (
          <div key={env.id} className="flex items-center gap-2">
            <Input
              placeholder="KEY"
              value={env.key}
              onChange={(e) => updateEnvVar(env.id, "key", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="VALUE"
              type={env.isVisible ? "text" : "password"}
              value={env.value}
              onChange={(e) => updateEnvVar(env.id, "value", e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleVisibility(env.id)}
              className="flex-shrink-0"
              title={env.isVisible ? "Hide value" : "Show value"}
            >
              {env.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-2 min-w-[120px]">
              <Switch
                checked={env.isSecret}
                onCheckedChange={(checked) => updateEnvVar(env.id, "isSecret", checked)}
                id={`secret-${env.id}`}
              />
              <label htmlFor={`secret-${env.id}`} className="text-sm">
                Secret
              </label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeEnvVar(env.id)}
              className="flex-shrink-0"
              title="Remove variable"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <LoadingButton
          onClick={handleSave}
          isLoading={isLoading}
          loadingText="Saving..."
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Variables
        </LoadingButton>
      </div>
    </div>
  )
}
