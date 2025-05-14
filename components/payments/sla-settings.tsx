"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export function SLASettings() {
  const { toast } = useToast()
  const [slaEnabled, setSlaEnabled] = useState(true)

  const handleSave = () => {
    toast({
      title: "SLA Settings Saved",
      description: "Your approval time commitment settings have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Approval Time Commitments</CardTitle>
            <CardDescription>Configure SLAs for payment approval workflow</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="sla-toggle" checked={slaEnabled} onCheckedChange={setSlaEnabled} />
            <Label htmlFor="sla-toggle">Enable SLAs</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="levels">Approval Levels</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business-hours-start">Business Hours Start</Label>
                <Select defaultValue="9">
                  <SelectTrigger id="business-hours-start">
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 7).map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour}:00 {hour < 12 ? "AM" : "PM"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-hours-end">Business Hours End</Label>
                <Select defaultValue="17">
                  <SelectTrigger id="business-hours-end">
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 12).map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour > 12 ? hour - 12 : hour}:00 PM
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-days">Business Days</Label>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Switch id={`day-${index}`} defaultChecked={index < 5} />
                    <Label htmlFor={`day-${index}`}>{day}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sla-calculation">SLA Calculation Method</Label>
              <Select defaultValue="business-hours">
                <SelectTrigger id="sla-calculation">
                  <SelectValue placeholder="Select calculation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business-hours">Business Hours Only</SelectItem>
                  <SelectItem value="calendar-hours">Calendar Hours (24/7)</SelectItem>
                  <SelectItem value="custom">Custom Schedule</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose how SLA time is calculated. Business hours only counts time during configured business hours.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="levels" className="space-y-6 pt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Level 1 Approval (Team Lead)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level1-standard">Standard Requests</Label>
                  <div className="flex space-x-2">
                    <Input id="level1-standard" type="number" defaultValue="4" className="w-20" />
                    <Select defaultValue="hours">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level1-urgent">Urgent Requests</Label>
                  <div className="flex space-x-2">
                    <Input id="level1-urgent" type="number" defaultValue="1" className="w-20" />
                    <Select defaultValue="hours">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Level 2 Approval (Department Head)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level2-standard">Standard Requests</Label>
                  <div className="flex space-x-2">
                    <Input id="level2-standard" type="number" defaultValue="8" className="w-20" />
                    <Select defaultValue="hours">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level2-urgent">Urgent Requests</Label>
                  <div className="flex space-x-2">
                    <Input id="level2-urgent" type="number" defaultValue="2" className="w-20" />
                    <Select defaultValue="hours">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Level 3 Approval (Finance Director)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level3-standard">Standard Requests</Label>
                  <div className="flex space-x-2">
                    <Input id="level3-standard" type="number" defaultValue="1" className="w-20" />
                    <Select defaultValue="days">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level3-urgent">Urgent Requests</Label>
                  <div className="flex space-x-2">
                    <Input id="level3-urgent" type="number" defaultValue="4" className="w-20" />
                    <Select defaultValue="hours">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="reminder-notifications">Reminder Notifications</Label>
                <Switch id="reminder-notifications" defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">
                Send reminders to approvers when SLA deadlines are approaching
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder-threshold">Reminder Threshold</Label>
              <div className="flex space-x-2">
                <Input id="reminder-threshold" type="number" defaultValue="75" className="w-20" />
                <span className="flex items-center">% of SLA time elapsed</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="escalation-notifications">Escalation Notifications</Label>
                <Switch id="escalation-notifications" defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically escalate to supervisors when SLA is breached
              </p>
            </div>

            <div className="space-y-2">
              <Label>Notification Channels</Label>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Switch id="email-notifications" defaultChecked />
                  <Label htmlFor="email-notifications">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="in-app-notifications" defaultChecked />
                  <Label htmlFor="in-app-notifications">In-App</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="slack-notifications" />
                  <Label htmlFor="slack-notifications">Slack</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sms-notifications" />
                  <Label htmlFor="sms-notifications">SMS</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
