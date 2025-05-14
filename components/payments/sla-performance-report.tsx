"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react"

export function SLAPerformanceReport() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>SLA Performance</CardTitle>
          <CardDescription>Approval time commitment metrics</CardDescription>
        </div>
        <Select defaultValue="30days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="byLevel">By Level</TabsTrigger>
            <TabsTrigger value="byCategory">By Category</TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <h4 className="text-sm font-medium">Met SLA</h4>
                </div>
                <div className="text-2xl font-bold">87%</div>
                <Progress value={87} className="h-2" />
                <p className="text-xs text-muted-foreground">+2.5% from last period</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <h4 className="text-sm font-medium">At Risk</h4>
                </div>
                <div className="text-2xl font-bold">9%</div>
                <Progress value={9} className="h-2" />
                <p className="text-xs text-muted-foreground">-1.3% from last period</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <h4 className="text-sm font-medium">Breached</h4>
                </div>
                <div className="text-2xl font-bold">4%</div>
                <Progress value={4} className="h-2" />
                <p className="text-xs text-muted-foreground">-1.2% from last period</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Average Response Time</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm">Level 1</div>
                  <div className="text-lg font-medium">2.3 hrs</div>
                  <div className="text-xs text-green-500">-0.5 hrs from target</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm">Level 2</div>
                  <div className="text-lg font-medium">5.7 hrs</div>
                  <div className="text-xs text-green-500">-2.3 hrs from target</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm">Level 3</div>
                  <div className="text-lg font-medium">18.2 hrs</div>
                  <div className="text-xs text-amber-500">+2.2 hrs from target</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="byLevel" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Level 1 (Team Lead)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Met SLA</div>
                    <div className="text-lg font-medium">92%</div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">At Risk</div>
                    <div className="text-lg font-medium">6%</div>
                    <Progress value={6} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Breached</div>
                    <div className="text-lg font-medium">2%</div>
                    <Progress value={2} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Level 2 (Department Head)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Met SLA</div>
                    <div className="text-lg font-medium">85%</div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">At Risk</div>
                    <div className="text-lg font-medium">10%</div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Breached</div>
                    <div className="text-lg font-medium">5%</div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Level 3 (Finance Director)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Met SLA</div>
                    <div className="text-lg font-medium">78%</div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">At Risk</div>
                    <div className="text-lg font-medium">12%</div>
                    <Progress value={12} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Breached</div>
                    <div className="text-lg font-medium">10%</div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="byCategory" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Vendor Payments</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Met SLA</div>
                    <div className="text-lg font-medium">90%</div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">At Risk</div>
                    <div className="text-lg font-medium">7%</div>
                    <Progress value={7} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Breached</div>
                    <div className="text-lg font-medium">3%</div>
                    <Progress value={3} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Expense Reimbursements</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Met SLA</div>
                    <div className="text-lg font-medium">95%</div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">At Risk</div>
                    <div className="text-lg font-medium">4%</div>
                    <Progress value={4} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Breached</div>
                    <div className="text-lg font-medium">1%</div>
                    <Progress value={1} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Capital Expenditures</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Met SLA</div>
                    <div className="text-lg font-medium">75%</div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">At Risk</div>
                    <div className="text-lg font-medium">15%</div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Breached</div>
                    <div className="text-lg font-medium">10%</div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
