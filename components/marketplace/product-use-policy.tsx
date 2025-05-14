import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Shield, AlertTriangle, CheckCircle, HelpCircle, Scale, FileCheck } from "lucide-react"

interface ProductUsePolicyProps {
  productId: string
  productName: string
}

export function ProductUsePolicy({ productId, productName }: ProductUsePolicyProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <FileCheck className="mr-2 h-6 w-6" />
                For Use Policy
              </h2>
              <p className="text-muted-foreground mt-1">
                Please review the terms and conditions for using {productName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <span className="flex items-center">
                  <Download className="mr-1 h-4 w-4" />
                  Download PDF
                </span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <span className="flex items-center">
                  <FileText className="mr-1 h-4 w-4" />
                  View Full License
                </span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="summary">
                <span className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Summary
                </span>
              </TabsTrigger>
              <TabsTrigger value="license">
                <span className="flex items-center">
                  <Scale className="mr-2 h-4 w-4" />
                  License Terms
                </span>
              </TabsTrigger>
              <TabsTrigger value="faq">
                <span className="flex items-center">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  FAQ
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold flex items-center text-green-700 dark:text-green-400">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Permitted Uses
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 dark:text-green-500" />
                          <span>Integration within your commercial applications</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 dark:text-green-500" />
                          <span>Modification for compatibility with your systems</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 dark:text-green-500" />
                          <span>Distribution as part of your solution</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 dark:text-green-500" />
                          <span>Use on unlimited projects within your organization</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold flex items-center text-red-700 dark:text-red-400">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Prohibited Uses
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-red-600 dark:text-red-500" />
                          <span>Reselling or redistributing as a standalone product</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-red-600 dark:text-red-500" />
                          <span>Removing copyright notices or attributions</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-red-600 dark:text-red-500" />
                          <span>Use in applications that compete directly with our products</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-red-600 dark:text-red-500" />
                          <span>Transfer of license to another entity</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold flex items-center text-blue-700 dark:text-blue-400">
                        <Shield className="mr-2 h-5 w-5" />
                        License Protection
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-start">
                          <Shield className="h-4 w-4 mr-2 mt-0.5 text-blue-600 dark:text-blue-500" />
                          <span>12 months of updates and security patches</span>
                        </li>
                        <li className="flex items-start">
                          <Shield className="h-4 w-4 mr-2 mt-0.5 text-blue-600 dark:text-blue-500" />
                          <span>Technical support via email and community forums</span>
                        </li>
                        <li className="flex items-start">
                          <Shield className="h-4 w-4 mr-2 mt-0.5 text-blue-600 dark:text-blue-500" />
                          <span>License indemnification up to $10,000</span>
                        </li>
                        <li className="flex items-start">
                          <Shield className="h-4 w-4 mr-2 mt-0.5 text-blue-600 dark:text-blue-500" />
                          <span>Compliance certification for enterprise use</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">License Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">License Type:</span>
                        <Badge>Commercial</Badge>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Duration:</span>
                        <span>Perpetual</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Updates:</span>
                        <span>12 months</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Support:</span>
                        <span>12 months</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Projects:</span>
                        <span>Unlimited</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Domains:</span>
                        <span>Unlimited</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Users:</span>
                        <span>Based on plan</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Source Code:</span>
                        <Badge variant="outline">Included</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="license">
              <div className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>1. License Grant</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">
                        Subject to the terms and conditions of this Agreement, we hereby grant you a non-exclusive,
                        non-transferable license to:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>
                          Install and use the Software on computers owned, leased, or controlled by you or your
                          organization.
                        </li>
                        <li>
                          Modify the Software to suit your customization requirements for use within your applications.
                        </li>
                        <li>
                          Use the Software in connection with the provision of your products and services to your
                          clients and customers.
                        </li>
                      </ul>
                      <p>
                        The license is effective until terminated. You may terminate it at any time by uninstalling the
                        Software and destroying all copies.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>2. Restrictions</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">You may not:</p>
                      <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>
                          Distribute, sublicense, lease, rent, loan, or otherwise make the Software available to any
                          third party except as expressly permitted herein.
                        </li>
                        <li>
                          Remove, alter, or obscure any proprietary notices (including copyright and trademark notices)
                          from the Software or its documentation.
                        </li>
                        <li>
                          Use the Software to develop applications that compete directly with our product offerings.
                        </li>
                        <li>
                          Reverse engineer, decompile, disassemble, or attempt to derive the source code of the
                          Software, except to the extent these restrictions are prohibited by applicable law.
                        </li>
                        <li>
                          Use the Software for any illegal purpose or in violation of any local, state, national, or
                          international law.
                        </li>
                      </ul>
                      <p>
                        Any violation of these restrictions may result in termination of your license and potential
                        legal action.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>3. Intellectual Property Rights</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">
                        The Software is licensed, not sold. We retain all right, title, and interest in and to the
                        Software, including all intellectual property rights. This includes:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>
                          All copyrights, trademarks, service marks, trade secrets, patents, and other proprietary
                          rights.
                        </li>
                        <li>All modifications, enhancements, adaptations, and derivative works.</li>
                        <li>All documentation, manuals, and supporting materials.</li>
                      </ul>
                      <p>
                        You acknowledge that you have no rights to the intellectual property contained in the Software
                        except as explicitly stated in this Agreement.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>4. Updates and Support</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">
                        This license includes access to updates and technical support for a period of 12 months from the
                        date of purchase.
                      </p>
                      <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>
                          <strong>Updates:</strong> During the support period, you are entitled to receive all minor
                          updates (e.g., from version 1.1 to 1.2) and major updates (e.g., from version 1.x to 2.0) at
                          no additional cost.
                        </li>
                        <li>
                          <strong>Technical Support:</strong> During the support period, you may submit support requests
                          via our designated support channels. Response times vary based on the severity of the issue.
                        </li>
                        <li>
                          <strong>Support Renewal:</strong> After the initial 12-month period, you may purchase
                          additional support and update coverage at our then-current rates.
                        </li>
                      </ul>
                      <p>
                        Without an active support subscription, you may continue to use the version of the Software you
                        have licensed, but will not receive updates or technical support.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>5. Warranty and Disclaimer</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">
                        We warrant that the Software will perform substantially in accordance with the documentation for
                        a period of 90 days from the date of purchase. If the Software does not conform to this
                        warranty, we will, at our option:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>Repair the Software</li>
                        <li>Replace the Software</li>
                        <li>Refund the purchase price</li>
                      </ul>
                      <p className="mb-4">
                        <strong>DISCLAIMER:</strong> EXCEPT FOR THE EXPRESS WARRANTY ABOVE, THE SOFTWARE IS PROVIDED "AS
                        IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE
                        IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                      </p>
                      <p>
                        WE DO NOT WARRANT THAT THE SOFTWARE WILL MEET YOUR REQUIREMENTS OR THAT THE OPERATION OF THE
                        SOFTWARE WILL BE UNINTERRUPTED OR ERROR-FREE.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>6. Limitation of Liability</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">
                        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY
                        SPECIAL, INCIDENTAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER (INCLUDING, WITHOUT
                        LIMITATION, DAMAGES FOR LOSS OF BUSINESS PROFITS, BUSINESS INTERRUPTION, LOSS OF BUSINESS
                        INFORMATION, OR ANY OTHER PECUNIARY LOSS) ARISING OUT OF THE USE OF OR INABILITY TO USE THE
                        SOFTWARE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                      </p>
                      <p>
                        IN ANY CASE, OUR ENTIRE LIABILITY UNDER ANY PROVISION OF THIS AGREEMENT SHALL BE LIMITED TO THE
                        AMOUNT ACTUALLY PAID BY YOU FOR THE SOFTWARE.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="faq">
              <div className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-1">
                    <AccordionTrigger>Can I use this product in multiple projects?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Yes, your license allows you to use the product in unlimited projects within your organization.
                        There is no limit to the number of projects, domains, or servers where you can deploy the
                        software, as long as they are owned or operated by your organization.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-2">
                    <AccordionTrigger>Can I modify the source code?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Yes, you are permitted to modify the source code for your own use. You can customize the
                        software to meet your specific requirements and integrate it with your systems. However, you
                        cannot distribute these modifications as a standalone product or remove our copyright notices.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-3">
                    <AccordionTrigger>Do I need to attribute your company in my project?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Attribution is not required in your end product or user interface. However, you must maintain
                        all copyright notices within the source code. If you choose to provide attribution, we
                        appreciate it, but it's not mandatory for compliance with the license terms.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-4">
                    <AccordionTrigger>What happens when my support period expires?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        After your 12-month support period expires, you can continue using the software indefinitely,
                        but you will no longer receive updates, security patches, or technical support. To regain access
                        to these services, you can purchase a support renewal at our current rates. We recommend keeping
                        your support active to ensure you have the latest security updates and features.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-5">
                    <AccordionTrigger>Can I include this product in my SaaS offering?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Yes, you can incorporate this product into your Software as a Service (SaaS) offering. You can
                        deploy the software on your servers and allow your customers to access its functionality through
                        your application. However, you cannot allow your customers to download, install, or access the
                        source code directly. Your customers should interact with the software only through your
                        application's interface.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-6">
                    <AccordionTrigger>What license do I need for multiple developers?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        The number of developers who can work with the software depends on your license tier. Standard
                        licenses typically cover up to 5 developers, while Enterprise licenses may cover unlimited
                        developers within your organization. If you need more developers than your current license
                        allows, please contact our sales team to upgrade your license or purchase additional seats.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-7">
                    <AccordionTrigger>Can I transfer my license to another company?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        No, licenses are non-transferable. They are issued specifically to the purchasing individual or
                        organization and cannot be transferred to another entity. In the case of a company acquisition
                        or merger, please contact our licensing department to discuss your specific situation and
                        potential options.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-8">
                    <AccordionTrigger>What is your refund policy?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        We offer a 30-day money-back guarantee. If you're not satisfied with the product, you can
                        request a full refund within 30 days of purchase. To request a refund, please contact our
                        support team with your order details. Please note that refunds are not available after 30 days
                        or if there's evidence of abuse of the refund policy.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
