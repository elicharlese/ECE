// Mock data for testing the order system
export const sampleOrders = [
  {
    id: 'order_001',
    userId: 'user_001',
    projectType: 'SAAS_DASHBOARD',
    title: 'Analytics Dashboard for SaaS Platform',
    description: 'A comprehensive dashboard with user analytics, billing management, and real-time metrics.',
    timeline: 'STANDARD_1_MONTH',
    estimatedCost: 4800,
    status: 'IN_PROGRESS',
    priority: 'STANDARD',
    progressPercentage: 45,
    currentMilestone: 'UI Components Development',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15'),
    assignedAdminId: 'admin_001'
  },
  {
    id: 'order_002',
    userId: 'user_002',
    projectType: 'ECOMMERCE_STORE',
    title: 'Fashion E-commerce Platform',
    description: 'Modern e-commerce store with payment processing, inventory management, and customer portal.',
    timeline: 'RUSH_2_WEEKS',
    estimatedCost: 10400,
    status: 'PENDING',
    priority: 'HIGH',
    progressPercentage: 0,
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: 'order_003',
    userId: 'user_003',
    projectType: 'PORTFOLIO_SITE',
    title: 'Creative Portfolio Website',
    description: 'Portfolio website for a digital artist with gallery, contact forms, and blog.',
    timeline: 'STANDARD_1_MONTH',
    estimatedCost: 3200,
    status: 'COMPLETED',
    priority: 'STANDARD',
    progressPercentage: 100,
    currentMilestone: 'Delivered',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-10'),
    deliveryDate: new Date('2024-12-10'),
    githubRepo: 'https://github.com/client/portfolio',
    vercelLink: 'https://client-portfolio.vercel.app',
    actualCost: 3200
  },
  {
    id: 'order_004',
    userId: 'user_004',
    projectType: 'MOBILE_APP',
    title: 'Fitness Tracking Mobile App',
    description: 'Cross-platform mobile app for fitness tracking with social features and workout plans.',
    timeline: 'RUSH_2_WEEKS',
    estimatedCost: 11200,
    status: 'REVIEW',
    priority: 'URGENT',
    progressPercentage: 85,
    currentMilestone: 'Final Testing',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-18'),
    assignedAdminId: 'admin_002'
  },
  {
    id: 'order_005',
    userId: 'user_005',
    projectType: 'LANDING_PAGE',
    title: 'Product Launch Landing Page',
    description: 'High-converting landing page for a new SaaS product with animations and lead capture.',
    timeline: 'STANDARD_1_MONTH',
    estimatedCost: 2400,
    status: 'APPROVED',
    priority: 'STANDARD',
    progressPercentage: 15,
    currentMilestone: 'Design Phase',
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-19'),
    assignedAdminId: 'admin_001'
  }
]

export const sampleStats = {
  total: 5,
  pending: 1,
  inProgress: 1,
  completed: 1,
  revenue: 16800,
  avgCompletionTime: 18
}
