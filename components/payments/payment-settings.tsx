import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Save, Bell, Mail, Smartphone } from "lucide-react"

export function PaymentSettings() {
  return (
    <Tabs defaultValue="general">
      <TabsList className="mb-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="approvals">Approval Workflow</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage general payment settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="default-currency">Default Currency</Label>
              <Select defaultValue="ece">
                <SelectTrigger id="default-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ece">ECE</SelectItem>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-prefix">Payment ID Prefix</Label>
              <Input id="payment-prefix" defaultValue="PAY-" />
              <p className="text-xs text-muted-foreground">This prefix will be added to all payment request IDs.</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Default Payment Settings</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-numbering">Auto-numbering</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically generate sequential payment request numbers
                  </p>
                </div>
                <Switch id="auto-numbering" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-attachments">Require Attachments</Label>
                  <p className="text-xs text-muted-foreground">Require at least one attachment for payment requests</p>
                </div>
                <Switch id="require-attachments" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-comments">Allow Comments</Label>
                  <p className="text-xs text-muted-foreground">Allow users to add comments to payment requests</p>
                </div>
                <Switch id="allow-comments" defaultChecked />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="approvals">
        <Card>
          <CardHeader>
            <CardTitle>Approval Workflow Settings</CardTitle>
            <CardDescription>Configure payment approval workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Default Approval Flow</h3>

              <RadioGroup defaultValue="multi-level">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single-level" id="single-level" />
                  <Label htmlFor="single-level">Single-level approval</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multi-level" id="multi-level" />
                  <Label htmlFor="multi-level">Multi-level approval</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="amount-based" id="amount-based" />
                  <Label htmlFor="amount-based">Amount-based approval levels</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Approval Thresholds</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level1-threshold">Level 1 Threshold</Label>
                  <Input id="level1-threshold" type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level1-approver">Level 1 Approver Role</Label>
                  <Select defaultValue="team-lead">
                    <SelectTrigger id="level1-approver">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team-lead">Team Lead</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level2-threshold">Level 2 Threshold</Label>
                  <Input id="level2-threshold" type="number" defaultValue="5000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level2-approver">Level 2 Approver Role</Label>
                  <Select defaultValue="director">
                    <SelectTrigger id="level2-approver">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="vp">VP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level3-threshold">Level 3 Threshold</Label>
                  <Input id="level3-threshold" type="number" defaultValue="10000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level3-approver">Level 3 Approver Role</Label>
                  <Select defaultValue="cfo">
                    <SelectTrigger id="level3-approver">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="vp">VP</SelectItem>
                      <SelectItem value="cfo">CFO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Approval Options</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-approve-below">Auto-approve Below Threshold</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically approve payments below the minimum threshold
                  </p>
                </div>
                <Switch id="auto-approve-below" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-comments">Require Comments for Rejection</Label>
                  <p className="text-xs text-muted-foreground">
                    Require approvers to provide comments when rejecting a payment
                  </p>
                </div>
                <Switch id="require-comments" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="escalation">Enable Approval Escalation</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically escalate approvals after a set time period
                  </p>
                </div>
                <Switch id="escalation" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure payment notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Email Notifications</h3>

              <div className="space-y-2">
                {["new-request", "approval-required", "request-approved", "request-rejected", "payment-processed"].map(
                  (id) => (
                    <div key={id} className="flex items-center space-x-2">
                      <Checkbox id={`email-${id}`} defaultChecked />
                      <Label htmlFor={`email-${id}`}>
                        {id === "new-request" && "New payment request created"}
                        {id === "approval-required" && "Payment approval required"}
                        {id === "request-approved" && "Payment request approved"}
                        {id === "request-rejected" && "Payment request rejected"}
                        {id === "payment-processed" && "Payment processed"}
                      </Label>
                    </div>
                  ),
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">In-App Notifications</h3>

              <div className="space-y-2">
                {[
                  "new-request",
                  "approval-required",
                  "request-approved",
                  "request-rejected",
                  "payment-processed",
                  "approaching-due-date",
                  "overdue-approvals",
                ].map((id) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox id={`app-${id}`} defaultChecked />
                    <Label htmlFor={`app-${id}`}>
                      {id === "new-request" && "New payment request created"}
                      {id === "approval-required" && "Payment approval required"}
                      {id === "request-approved" && "Payment request approved"}
                      {id === "request-rejected" && "Payment request rejected"}
                      {id === "payment-processed" && "Payment processed"}
                      {id === "approaching-due-date" && "Approaching due date"}
                      {id === "overdue-approvals" && "Overdue approvals"}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Delivery</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Email</CardTitle>
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-enabled">Enabled</Label>
                      <Switch id="email-enabled" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">In-App</CardTitle>
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="app-enabled">Enabled</Label>
                      <Switch id="app-enabled" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Mobile Push</CardTitle>
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-enabled">Enabled</Label>
                      <Switch id="push-enabled" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure payment security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Authentication Requirements</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa-approvals">Require 2FA for Approvals</Label>
                  <p className="text-xs text-muted-foreground">
                    Require two-factor authentication for payment approvals
                  </p>
                </div>
                <Switch id="2fa-approvals" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-confirmation">Email Confirmation for Large Payments</Label>
                  <p className="text-xs text-muted-foreground">Send email confirmation for payments above threshold</p>
                </div>
                <Switch id="email-confirmation" defaultChecked />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Payment Limits</h3>

              <div className="space-y-2">
                <Label htmlFor="max-payment">Maximum Payment Amount</Label>
                <Input id="max-payment" type="number" defaultValue="50000" />
                <p className="text-xs text-muted-foreground">Maximum amount allowed for a single payment request</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="daily-limit">Daily Payment Limit</Label>
                <Input id="daily-limit" type="number" defaultValue="100000" />
                <p className="text-xs text-muted-foreground">Maximum total amount allowed per day</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Audit & Compliance</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="detailed-logging">Detailed Audit Logging</Label>
                  <p className="text-xs text-muted-foreground">Log detailed information for all payment activities</p>
                </div>
                <Switch id="detailed-logging" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ip-tracking">IP Address Tracking</Label>
                  <p className="text-xs text-muted-foreground">Track IP addresses for all payment actions</p>
                </div>
                <Switch id="ip-tracking" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention-period">Audit Log Retention Period (days)</Label>
                <Input id="retention-period" type="number" defaultValue="365" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="integrations">
        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
            <CardDescription>Configure payment integrations with other systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Accounting System</CardTitle>
                  <CardDescription>Sync payments with your accounting system</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="accounting-enabled">Enabled</Label>
                      <Switch id="accounting-enabled" defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accounting-system">System</Label>
                      <Select defaultValue="quickbooks">
                        <SelectTrigger id="accounting-system">
                          <SelectValue placeholder="Select system" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quickbooks">QuickBooks</SelectItem>
                          <SelectItem value="xero">Xero</SelectItem>
                          <SelectItem value="sage">Sage</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accounting-sync">Sync Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="accounting-sync">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Configure
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Banking Integration</CardTitle>
                  <CardDescription>Connect with your banking system</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="banking-enabled">Enabled</Label>
                      <Switch id="banking-enabled" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="banking-provider">Provider</Label>
                      <Select defaultValue="placeholder">
                        <SelectTrigger id="banking-provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="placeholder">Select provider</SelectItem>
                          <SelectItem value="plaid">Plaid</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="banking-mode">Mode</Label>
                      <Select defaultValue="sandbox">
                        <SelectTrigger id="banking-mode">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sandbox">Sandbox</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Connect
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Document Management</CardTitle>
                  <CardDescription>Integrate with document management systems</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="document-enabled">Enabled</Label>
                      <Switch id="document-enabled" defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="document-system">System</Label>
                      <Select defaultValue="sharepoint">
                        <SelectTrigger id="document-system">
                          <SelectValue placeholder="Select system" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sharepoint">SharePoint</SelectItem>
                          <SelectItem value="gdrive">Google Drive</SelectItem>
                          <SelectItem value="dropbox">Dropbox</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Configure
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">API Integration</CardTitle>
                  <CardDescription>Connect with external systems via API</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="api-enabled">Enabled</Label>
                      <Switch id="api-enabled" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input id="api-key" type="password" value="••••••••••••••••" readOnly />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-webhook">Webhook URL</Label>
                      <Input id="api-webhook" placeholder="https://your-webhook-url.com" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Manage API Keys
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
          <CardFooter>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
