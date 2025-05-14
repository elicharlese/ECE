"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/hooks/use-toast"
import { useDemo } from "@/lib/demo-context"
import { PlusCircle, Trash2, ExternalLink, Check, AlertTriangle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Domain = {
  id: string
  name: string
  status: "pending" | "active" | "error"
  isCustom: boolean
  createdAt: Date
}

export function AppDomainSettings() {
  const { toast } = useToast()
  const { isDemoMode } = useDemo()
  const [isLoading, setIsLoading] = useState(false)
  const [newDomain, setNewDomain] = useState("")
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: "1",
      name: "my-app.ece-platform.com",
      status: "active",
      isCustom: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      name: "staging.my-app.com",
      status: "active",
      isCustom: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "dev.my-app.com",
      status: "pending",
      isCustom: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ])

  const addDomain = async () => {
    if (!newDomain) return

    setIsLoading(true)

    try {
      if (isDemoMode) {
        // Simulate API call for demo mode
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const newId = `domain_${Date.now()}`
        setDomains([
          ...domains,
          {
            id: newId,
            name: newDomain,
            status: "pending",
            isCustom: true,
            createdAt: new Date(),
          },
        ])

        setNewDomain("")

        toast({
          title: "Domain added",
          description: "Your domain has been added and is pending verification.",
          variant: "default",
        })
      } else {
        // Here you would actually add the domain to your backend
        // const newDomain = await addAppDomain(appId, newDomain)
        // setDomains([...domains, newDomain])
      }
    } catch (error) {
      console.error("Domain add error:", error)
      toast({
        title: "Error",
        description: "Failed to add domain. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeDomain = async (id: string) => {
    try {
      if (isDemoMode) {
        // Simulate API call for demo mode
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setDomains(domains.filter((domain) => domain.id !== id))

        toast({
          title: "Domain removed",
          description: "The domain has been removed successfully.",
          variant: "default",
        })
      } else {
        // Here you would actually remove the domain from your backend
        // await removeAppDomain(appId, id)
        // setDomains(domains.filter(domain => domain.id !== id))
      }
    } catch (error) {
      console.error("Domain remove error:", error)
      toast({
        title: "Error",
        description: "Failed to remove domain. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Check className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "pending":
        return "Pending verification"
      case "error":
        return "Configuration error"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Domains</h3>
      </div>

      <Alert variant="default" className="bg-muted/50">
        <AlertDescription>
          Add custom domains to your application. For custom domains, you'll need to configure DNS settings.
        </AlertDescription>
      </Alert>

      <div className="flex gap-2">
        <Input
          placeholder="example.com"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          className="flex-1"
        />
        <LoadingButton
          onClick={addDomain}
          isLoading={isLoading}
          loadingText="Adding..."
          disabled={!newDomain}
          className="bg-primary hover:bg-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Domain
        </LoadingButton>
      </div>

      <div className="space-y-4 mt-6">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 font-medium text-sm text-muted-foreground">
          <div>Domain</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {domains.map((domain) => (
          <div key={domain.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-2 border-b">
            <div className="flex items-center gap-2">
              {domain.name}
              {domain.isCustom ? (
                <Badge variant="outline" className="ml-2">
                  Custom
                </Badge>
              ) : (
                <Badge variant="secondary" className="ml-2">
                  Default
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {getStatusIcon(domain.status)}
              <span
                className={`text-sm ${
                  domain.status === "active"
                    ? "text-green-500"
                    : domain.status === "pending"
                      ? "text-amber-500"
                      : "text-red-500"
                }`}
              >
                {getStatusText(domain.status)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(`https://${domain.name}`, "_blank")}
                title="Visit domain"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              {domain.isCustom && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDomain(domain.id)}
                  title="Remove domain"
                  disabled={!domain.isCustom}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
