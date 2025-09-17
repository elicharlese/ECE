/**
 * Contract Management Service
 * Handles legal agreements, licensing, and contract generation
 */

import { AppOrder } from './app-generation-orchestrator.service'

export interface Contract {
  id: string
  orderId: string
  customerId: string
  type: 'service_agreement' | 'license_agreement' | 'nda' | 'custom'
  title: string
  content: string
  terms: ContractTerms
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled'
  signatures: ContractSignature[]
  metadata: {
    version: string
    templateId?: string
    generatedAt: Date
    expiresAt?: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface ContractTerms {
  deliverables: string[]
  timeline: {
    startDate: Date
    deliveryDate: Date
    revisionPeriod: number // days
  }
  payment: {
    totalAmount: number
    currency: string
    schedule: 'upfront' | 'milestone' | 'completion'
    milestones?: Array<{
      description: string
      percentage: number
      dueDate: Date
    }>
  }
  intellectualProperty: {
    codeOwnership: 'client' | 'vendor' | 'shared'
    licenseType: 'MIT' | 'GPL' | 'Apache' | 'Proprietary' | 'Custom'
    commercialRights: boolean
    redistributionRights: boolean
    modificationRights: boolean
  }
  revisions: {
    includedRevisions: number
    additionalRevisionCost: number
    revisionTimeframe: number // days
  }
  support: {
    duration: number // months
    level: 'basic' | 'standard' | 'premium'
    responseTime: string
  }
  liability: {
    limitOfLiability: number
    warrantyPeriod: number // months
    disclaimers: string[]
  }
  termination: {
    noticePeriod: number // days
    terminationConditions: string[]
    refundPolicy: string
  }
}

export interface ContractSignature {
  signerId: string
  signerName: string
  signerEmail: string
  signerRole: 'client' | 'vendor' | 'witness'
  signedAt: Date
  ipAddress: string
  userAgent: string
  signatureData: string // Base64 encoded signature image
}

export interface ContractTemplate {
  id: string
  name: string
  description: string
  category: 'standard' | 'premium' | 'enterprise' | 'custom'
  content: string
  variables: Array<{
    name: string
    type: 'text' | 'number' | 'date' | 'boolean'
    description: string
    required: boolean
    defaultValue?: any
  }>
  createdAt: Date
  updatedAt: Date
}

export class ContractService {
  private contracts: Map<string, Contract> = new Map()
  private templates: Map<string, ContractTemplate> = new Map()
  
  constructor() {
    this.initializeTemplates()
  }
  
  /**
   * Generate contract for order
   */
  async generateContract(order: AppOrder, templateId?: string): Promise<Contract> {
    const template = templateId 
      ? this.templates.get(templateId)
      : this.selectDefaultTemplate(order.appSpecification.complexity)
    
    if (!template) {
      throw new Error('Contract template not found')
    }
    
    // Generate contract terms based on order
    const terms = this.generateContractTerms(order)
    
    // Generate contract content from template
    const content = this.populateTemplate(template, order, terms)
    
    const contract: Contract = {
      id: `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: order.id,
      customerId: order.userId,
      type: 'service_agreement',
      title: `App Development Service Agreement - ${order.appSpecification.name}`,
      content,
      terms,
      status: 'draft',
      signatures: [],
      metadata: {
        version: '1.0',
        templateId: template.id,
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Store contract
    this.contracts.set(contract.id, contract)
    
    console.log(`📋 Contract generated: ${contract.id} for order: ${order.id}`)
    
    return contract
  }
  
  /**
   * Get contract by ID
   */
  async getContract(contractId: string): Promise<Contract> {
    const contract = this.contracts.get(contractId)
    if (!contract) {
      throw new Error(`Contract not found: ${contractId}`)
    }
    return contract
  }
  
  /**
   * Get contracts for order
   */
  async getOrderContracts(orderId: string): Promise<Contract[]> {
    return Array.from(this.contracts.values())
      .filter(contract => contract.orderId === orderId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
  
  /**
   * Send contract for signature
   */
  async sendForSignature(contractId: string, signers: Array<{
    email: string
    name: string
    role: 'client' | 'vendor' | 'witness'
  }>): Promise<void> {
    const contract = await this.getContract(contractId)
    
    if (contract.status !== 'draft') {
      throw new Error('Contract must be in draft status to send for signature')
    }
    
    // Update contract status
    contract.status = 'sent'
    contract.updatedAt = new Date()
    this.contracts.set(contractId, contract)
    
    // Send signature requests (would integrate with DocuSign, HelloSign, etc.)
    for (const signer of signers) {
      await this.sendSignatureRequest(contract, signer)
    }
    
    console.log(`📤 Contract sent for signature: ${contractId}`)
  }
  
  /**
   * Sign contract
   */
  async signContract(
    contractId: string, 
    signerId: string, 
    signerName: string, 
    signerEmail: string, 
    signerRole: 'client' | 'vendor' | 'witness',
    signatureData: string,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    const contract = await this.getContract(contractId)
    
    if (contract.status !== 'sent') {
      throw new Error('Contract must be sent for signature')
    }
    
    // Check if signer already signed
    const existingSignature = contract.signatures.find(s => s.signerId === signerId)
    if (existingSignature) {
      throw new Error('Signer has already signed this contract')
    }
    
    // Add signature
    const signature: ContractSignature = {
      signerId,
      signerName,
      signerEmail,
      signerRole,
      signedAt: new Date(),
      ipAddress,
      userAgent,
      signatureData
    }
    
    contract.signatures.push(signature)
    contract.updatedAt = new Date()
    
    // Check if all required signatures are collected
    const requiredSignatures = ['client', 'vendor'] // Basic requirement
    const collectedRoles = contract.signatures.map(s => s.signerRole)
    const allSigned = requiredSignatures.every(role => 
      collectedRoles.includes(role as ContractSignature['signerRole'])
    )
    
    if (allSigned) {
      contract.status = 'signed'
      console.log(`✅ Contract fully signed: ${contractId}`)
      
      // Trigger contract completion workflow
      await this.onContractSigned(contract)
    }
    
    this.contracts.set(contractId, contract)
    
    console.log(`✍️ Contract signed by ${signerName} (${signerRole}): ${contractId}`)
  }
  
  /**
   * Cancel contract
   */
  async cancelContract(contractId: string, reason: string): Promise<void> {
    const contract = await this.getContract(contractId)
    
    if (contract.status === 'signed') {
      throw new Error('Cannot cancel a signed contract')
    }
    
    contract.status = 'cancelled'
    contract.updatedAt = new Date()
    this.contracts.set(contractId, contract)
    
    console.log(`❌ Contract cancelled: ${contractId} - Reason: ${reason}`)
  }
  
  /**
   * Get contract templates
   */
  async getTemplates(): Promise<ContractTemplate[]> {
    return Array.from(this.templates.values())
      .sort((a, b) => a.name.localeCompare(b.name))
  }
  
  /**
   * Create custom contract template
   */
  async createTemplate(templateData: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContractTemplate> {
    const template: ContractTemplate = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...templateData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.templates.set(template.id, template)
    
    console.log(`📝 Contract template created: ${template.id}`)
    
    return template
  }
  
  /**
   * Update contract template
   */
  async updateTemplate(templateId: string, updates: Partial<ContractTemplate>): Promise<ContractTemplate> {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }
    
    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date()
    }
    
    this.templates.set(templateId, updatedTemplate)
    
    console.log(`📝 Contract template updated: ${templateId}`)
    
    return updatedTemplate
  }
  
  /**
   * Generate contract amendment
   */
  async generateAmendment(contractId: string, changes: {
    description: string
    modifications: Array<{
      section: string
      oldValue: string
      newValue: string
    }>
  }): Promise<Contract> {
    const originalContract = await this.getContract(contractId)
    
    if (originalContract.status !== 'signed') {
      throw new Error('Can only create amendments for signed contracts')
    }
    
    // Create amendment contract
    const amendment: Contract = {
      id: `amendment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: originalContract.orderId,
      customerId: originalContract.customerId,
      type: 'custom',
      title: `Amendment to ${originalContract.title}`,
      content: this.generateAmendmentContent(originalContract, changes),
      terms: originalContract.terms, // Copy original terms, would modify as needed
      status: 'draft',
      signatures: [],
      metadata: {
        version: '1.0',
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.contracts.set(amendment.id, amendment)
    
    console.log(`📋 Contract amendment generated: ${amendment.id}`)
    
    return amendment
  }
  
  /**
   * Get contract analytics
   */
  async getContractAnalytics(): Promise<{
    totalContracts: number
    signedContracts: number
    pendingContracts: number
    expiredContracts: number
    averageSigningTime: number // hours
    contractsByType: Record<string, number>
    signatureCompletionRate: number
    monthlyTrends: Array<{
      month: string
      contracts: number
      signed: number
    }>
  }> {
    const contracts = Array.from(this.contracts.values())
    
    const signedContracts = contracts.filter(c => c.status === 'signed')
    const pendingContracts = contracts.filter(c => c.status === 'sent')
    const expiredContracts = contracts.filter(c => 
      c.status === 'expired' || 
      (c.metadata.expiresAt && c.metadata.expiresAt < new Date())
    )
    
    // Calculate average signing time
    const signingTimes = signedContracts
      .filter(c => c.signatures.length > 0)
      .map(c => {
        const lastSignature = c.signatures.sort((a, b) => 
          b.signedAt.getTime() - a.signedAt.getTime()
        )[0]
        return lastSignature.signedAt.getTime() - c.createdAt.getTime()
      })
    
    const averageSigningTime = signingTimes.length > 0
      ? signingTimes.reduce((sum, time) => sum + time, 0) / signingTimes.length / (1000 * 60 * 60) // Convert to hours
      : 0
    
    // Contract type distribution
    const contractsByType = contracts.reduce((acc, contract) => {
      acc[contract.type] = (acc[contract.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Signature completion rate
    const sentContracts = contracts.filter(c => c.status === 'sent' || c.status === 'signed')
    const signatureCompletionRate = sentContracts.length > 0
      ? (signedContracts.length / sentContracts.length) * 100
      : 0
    
    // Monthly trends (last 12 months)
    const monthlyTrends = this.calculateMonthlyTrends(contracts)
    
    return {
      totalContracts: contracts.length,
      signedContracts: signedContracts.length,
      pendingContracts: pendingContracts.length,
      expiredContracts: expiredContracts.length,
      averageSigningTime: Math.round(averageSigningTime * 100) / 100,
      contractsByType,
      signatureCompletionRate: Math.round(signatureCompletionRate * 100) / 100,
      monthlyTrends
    }
  }
  
  // Private helper methods
  
  private initializeTemplates(): void {
    // Standard service agreement template
    const standardTemplate: ContractTemplate = {
      id: 'standard_service_agreement',
      name: 'Standard Service Agreement',
      description: 'Standard app development service agreement',
      category: 'standard',
      content: this.getStandardContractTemplate(),
      variables: [
        { name: 'clientName', type: 'text', description: 'Client name', required: true },
        { name: 'appName', type: 'text', description: 'Application name', required: true },
        { name: 'totalAmount', type: 'number', description: 'Total contract amount', required: true },
        { name: 'deliveryDate', type: 'date', description: 'Delivery date', required: true },
        { name: 'revisions', type: 'number', description: 'Number of included revisions', required: true }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.templates.set(standardTemplate.id, standardTemplate)
    
    // Premium service agreement template
    const premiumTemplate: ContractTemplate = {
      id: 'premium_service_agreement',
      name: 'Premium Service Agreement',
      description: 'Premium app development service agreement with extended terms',
      category: 'premium',
      content: this.getPremiumContractTemplate(),
      variables: [
        { name: 'clientName', type: 'text', description: 'Client name', required: true },
        { name: 'appName', type: 'text', description: 'Application name', required: true },
        { name: 'totalAmount', type: 'number', description: 'Total contract amount', required: true },
        { name: 'deliveryDate', type: 'date', description: 'Delivery date', required: true },
        { name: 'supportDuration', type: 'number', description: 'Support duration in months', required: true }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.templates.set(premiumTemplate.id, premiumTemplate)
  }
  
  private selectDefaultTemplate(complexity: string): ContractTemplate | undefined {
    switch (complexity) {
      case 'simple':
      case 'medium':
        return this.templates.get('standard_service_agreement')
      case 'complex':
      case 'enterprise':
        return this.templates.get('premium_service_agreement')
      default:
        return this.templates.get('standard_service_agreement')
    }
  }
  
  private generateContractTerms(order: AppOrder): ContractTerms {
    const revisionCounts = {
      simple: 2,
      medium: 3,
      complex: 5,
      enterprise: 10
    }
    
    const supportDurations = {
      simple: 3,
      medium: 6,
      complex: 12,
      enterprise: 24
    }
    
    return {
      deliverables: [
        'Complete application source code',
        'Deployment configuration',
        'Technical documentation',
        'User guide',
        ...order.appSpecification.features.map(f => `${f} implementation`)
      ],
      timeline: {
        startDate: new Date(),
        deliveryDate: order.timeline.estimatedCompletion,
        revisionPeriod: 14 // 14 days for revisions
      },
      payment: {
        totalAmount: order.pricing.totalAmount,
        currency: order.pricing.currency,
        schedule: order.pricing.totalAmount >= 10000 ? 'milestone' : 'upfront',
        milestones: order.pricing.totalAmount >= 10000 ? [
          { description: 'Project initiation', percentage: 30, dueDate: new Date() },
          { description: 'Core development completion', percentage: 40, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
          { description: 'Final delivery', percentage: 30, dueDate: order.timeline.estimatedCompletion }
        ] : undefined
      },
      intellectualProperty: {
        codeOwnership: order.legal.codeOwnership,
        licenseType: order.legal.licenseType,
        commercialRights: order.legal.commercialRights,
        redistributionRights: order.legal.redistributionRights,
        modificationRights: true
      },
      revisions: {
        includedRevisions: revisionCounts[order.appSpecification.complexity] || 2,
        additionalRevisionCost: Math.round(order.pricing.totalAmount * 0.1), // 10% of total
        revisionTimeframe: 14 // 14 days
      },
      support: {
        duration: supportDurations[order.appSpecification.complexity] || 3,
        level: order.appSpecification.complexity === 'enterprise' ? 'premium' : 'standard',
        responseTime: order.appSpecification.complexity === 'enterprise' ? '4 hours' : '24 hours'
      },
      liability: {
        limitOfLiability: order.pricing.totalAmount * 2, // 2x contract value
        warrantyPeriod: 6, // 6 months
        disclaimers: [
          'No warranty for third-party integrations',
          'Performance depends on hosting environment',
          'Client responsible for content and data'
        ]
      },
      termination: {
        noticePeriod: 7, // 7 days
        terminationConditions: [
          'Breach of contract terms',
          'Non-payment of invoices',
          'Mutual agreement'
        ],
        refundPolicy: 'Refunds based on work completed and milestone payments'
      }
    }
  }
  
  private populateTemplate(template: ContractTemplate, order: AppOrder, terms: ContractTerms): string {
    let content = template.content
    
    // Replace template variables
    const variables = {
      clientName: order.customerInfo.name,
      clientEmail: order.customerInfo.email,
      appName: order.appSpecification.name,
      appDescription: order.appSpecification.description,
      totalAmount: order.pricing.totalAmount,
      currency: order.pricing.currency,
      deliveryDate: terms.timeline.deliveryDate.toLocaleDateString(),
      revisions: terms.revisions.includedRevisions,
      supportDuration: terms.support.duration,
      contractDate: new Date().toLocaleDateString()
    }
    
    // Replace placeholders
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g')
      content = content.replace(placeholder, String(value))
    })
    
    return content
  }
  
  private getStandardContractTemplate(): string {
    return `
APP DEVELOPMENT SERVICE AGREEMENT

This Agreement is entered into on {{contractDate}} between {{clientName}} ("Client") and ECE Trading Cards ("Developer").

1. PROJECT SCOPE
Developer agrees to create and deliver the application "{{appName}}" as described: {{appDescription}}

2. PAYMENT TERMS
Total Amount: {{currency}} {{totalAmount}}
Payment Schedule: As specified in the order

3. DELIVERY
Estimated Delivery Date: {{deliveryDate}}
Included Revisions: {{revisions}}

4. INTELLECTUAL PROPERTY
Code ownership and licensing terms as specified in the order.

5. WARRANTIES
Developer warrants that the delivered application will be free from defects for 6 months.

6. LIMITATION OF LIABILITY
Developer's liability is limited to the contract amount.

7. TERMINATION
Either party may terminate with 7 days written notice.

By signing below, both parties agree to the terms of this Agreement.

_________________________    _________________________
Client Signature             Developer Signature

Date: _______________        Date: _______________
`
  }
  
  private getPremiumContractTemplate(): string {
    return `
PREMIUM APP DEVELOPMENT SERVICE AGREEMENT

This comprehensive Agreement is entered into on {{contractDate}} between {{clientName}} ("Client") and ECE Trading Cards ("Developer").

1. PROJECT SCOPE AND DELIVERABLES
Developer agrees to create and deliver the application "{{appName}}" with the following specifications:
- {{appDescription}}
- Complete source code with documentation
- Deployment and configuration support
- {{supportDuration}} months of post-delivery support

2. PAYMENT AND BILLING
Total Contract Value: {{currency}} {{totalAmount}}
Payment terms and milestone schedule as specified in the order.

3. TIMELINE AND DELIVERY
Estimated Delivery: {{deliveryDate}}
Revision Period: 14 days after delivery
Included Revisions: {{revisions}}

4. INTELLECTUAL PROPERTY RIGHTS
Detailed ownership, licensing, and usage rights as specified in the order terms.

5. SUPPORT AND MAINTENANCE
{{supportDuration}} months of technical support included
Response time: 24 hours for standard issues
Bug fixes and minor updates included

6. WARRANTIES AND GUARANTEES
6-month warranty on delivered software
Performance guarantees as specified

7. CONFIDENTIALITY
Both parties agree to maintain confidentiality of proprietary information.

8. LIMITATION OF LIABILITY
Liability limitations and indemnification clauses.

9. DISPUTE RESOLUTION
Disputes to be resolved through arbitration.

10. TERMINATION
Termination procedures and refund policies.

This Agreement represents the complete understanding between the parties.

_________________________    _________________________
Client Signature             Developer Signature

Date: _______________        Date: _______________
`
  }
  
  private generateAmendmentContent(originalContract: Contract, changes: any): string {
    return `
AMENDMENT TO CONTRACT ${originalContract.id}

This Amendment modifies the original agreement titled "${originalContract.title}" dated ${originalContract.createdAt.toLocaleDateString()}.

CHANGES:
${changes.description}

MODIFICATIONS:
${changes.modifications.map((mod: any) => 
  `- ${mod.section}: "${mod.oldValue}" is changed to "${mod.newValue}"`
).join('\n')}

All other terms of the original agreement remain in full force and effect.

_________________________    _________________________
Client Signature             Developer Signature

Date: _______________        Date: _______________
`
  }
  
  private async sendSignatureRequest(contract: Contract, signer: any): Promise<void> {
    // Would integrate with e-signature service (DocuSign, HelloSign, etc.)
    console.log(`📧 Signature request sent to ${signer.email} for contract ${contract.id}`)
  }
  
  private async onContractSigned(contract: Contract): Promise<void> {
    // Trigger workflow when contract is fully signed
    console.log(`🎉 Contract workflow triggered for ${contract.id}`)
    
    // Would integrate with order service to update order status
    // await orderService.updateOrderStatus(contract.orderId, 'contract_signed')
  }
  
  private calculateMonthlyTrends(contracts: Contract[]) {
    const monthlyData = new Map<string, { contracts: number; signed: number }>()
    
    contracts.forEach(contract => {
      const monthKey = contract.createdAt.toISOString().slice(0, 7) // YYYY-MM format
      const existing = monthlyData.get(monthKey) || { contracts: 0, signed: 0 }
      
      existing.contracts += 1
      if (contract.status === 'signed') {
        existing.signed += 1
      }
      
      monthlyData.set(monthKey, existing)
    })
    
    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        contracts: data.contracts,
        signed: data.signed
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12) // Last 12 months
  }
}

// Export singleton instance
export const contractService = new ContractService()
