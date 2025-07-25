// GitHub Repository Cards Data for ECE Profile
// These repositories will be available for betting, battling, and bidding

export interface GitHubRepoCard {
  id: string
  name: string
  displayName: string
  category: 'majors' | 'minors' | 'mvps'
  githubUrl: string
  description: string
  techStack: string[]
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise'
  estimatedValue: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  stats: {
    innovation: number // 1-100
    scalability: number // 1-100
    marketPotential: number // 1-100
    technicalDepth: number // 1-100
  }
  features: string[]
  deploymentOptions: string[]
  battleStats: {
    attack: number
    defense: number
    speed: number
    utility: number
  }
  isPublicForTrading: boolean
  owner: string
  createdAt: string
  lastUpdated: string
}

export const ELICHARLESE_REPO_CARDS: GitHubRepoCard[] = [
  // MAJORS
  {
    id: 'cec-001',
    name: 'CEC',
    displayName: 'Creative Ecommerce Co',
    category: 'majors',
    githubUrl: 'https://github.com/elicharlese/CEC',
    description: 'Full-stack ecommerce platform with advanced features and modern architecture',
    techStack: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    complexity: 'enterprise',
    estimatedValue: 2500,
    rarity: 'legendary',
    stats: {
      innovation: 95,
      scalability: 90,
      marketPotential: 98,
      technicalDepth: 85
    },
    features: ['Payment Processing', 'User Management', 'Admin Dashboard', 'Analytics'],
    deploymentOptions: ['AWS', 'Vercel', 'Docker'],
    battleStats: {
      attack: 95,
      defense: 88,
      speed: 82,
      utility: 90
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-01-15',
    lastUpdated: '2025-01-20'
  },
  {
    id: 'ts-002',
    name: 'TS',
    displayName: 'TypeScript Suite',
    category: 'majors',
    githubUrl: 'https://github.com/elicharlese/TS',
    description: 'Advanced TypeScript utilities and frameworks for enterprise development',
    techStack: ['TypeScript', 'Node.js', 'Webpack', 'Jest'],
    complexity: 'complex',
    estimatedValue: 1800,
    rarity: 'epic',
    stats: {
      innovation: 88,
      scalability: 95,
      marketPotential: 75,
      technicalDepth: 98
    },
    features: ['Type Safety', 'Build Tools', 'Testing Framework', 'Documentation'],
    deploymentOptions: ['NPM', 'GitHub Packages', 'CDN'],
    battleStats: {
      attack: 78,
      defense: 95,
      speed: 88,
      utility: 92
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-02-10',
    lastUpdated: '2025-01-18'
  },
  {
    id: 'tdt-003',
    name: 'TDT',
    displayName: 'Trading Data Terminal',
    category: 'majors',
    githubUrl: 'https://github.com/elicharlese/TDT',
    description: 'Real-time trading data terminal with advanced analytics and visualization',
    techStack: ['React', 'WebSocket', 'D3.js', 'Redis', 'Python'],
    complexity: 'enterprise',
    estimatedValue: 3200,
    rarity: 'mythic',
    stats: {
      innovation: 98,
      scalability: 85,
      marketPotential: 95,
      technicalDepth: 92
    },
    features: ['Real-time Data', 'Advanced Charts', 'Trading Algorithms', 'Risk Management'],
    deploymentOptions: ['AWS', 'Azure', 'GCP'],
    battleStats: {
      attack: 98,
      defense: 85,
      speed: 95,
      utility: 88
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-03-05',
    lastUpdated: '2025-01-22'
  },
  {
    id: 'omni-004',
    name: 'OMNI',
    displayName: 'Omni Platform',
    category: 'majors',
    githubUrl: 'https://github.com/elicharles/OMNI',
    description: 'Multi-platform integration system for seamless cross-platform operations',
    techStack: ['Go', 'gRPC', 'Kubernetes', 'Docker', 'MongoDB'],
    complexity: 'enterprise',
    estimatedValue: 2800,
    rarity: 'legendary',
    stats: {
      innovation: 92,
      scalability: 98,
      marketPotential: 88,
      technicalDepth: 95
    },
    features: ['Cross-platform API', 'Microservices', 'Service Mesh', 'Auto-scaling'],
    deploymentOptions: ['Kubernetes', 'Docker Swarm', 'Cloud Native'],
    battleStats: {
      attack: 85,
      defense: 98,
      speed: 92,
      utility: 95
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-04-12',
    lastUpdated: '2025-01-19'
  },
  {
    id: 'spectra-005',
    name: 'SPECTRA',
    displayName: 'Spectral Analysis Suite',
    category: 'majors',
    githubUrl: 'https://github.com/elicharlese/SPECTRA',
    description: 'Advanced spectral analysis and data visualization platform',
    techStack: ['Python', 'NumPy', 'SciPy', 'React', 'WebGL'],
    complexity: 'complex',
    estimatedValue: 2200,
    rarity: 'epic',
    stats: {
      innovation: 95,
      scalability: 78,
      marketPotential: 82,
      technicalDepth: 98
    },
    features: ['Scientific Computing', '3D Visualization', 'Data Analysis', 'Export Tools'],
    deploymentOptions: ['Jupyter Hub', 'Docker', 'Cloud Computing'],
    battleStats: {
      attack: 88,
      defense: 75,
      speed: 85,
      utility: 95
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-05-20',
    lastUpdated: '2025-01-16'
  },
  {
    id: 'stoke-006',
    name: 'STOKE',
    displayName: 'Stoke Engine',
    category: 'majors',
    githubUrl: 'https://github.com/elicharlese/STOKE',
    description: 'High-performance game engine with modern rendering pipeline',
    techStack: ['C++', 'Vulkan', 'OpenGL', 'Lua', 'CMake'],
    complexity: 'enterprise',
    estimatedValue: 3500,
    rarity: 'mythic',
    stats: {
      innovation: 98,
      scalability: 88,
      marketPotential: 85,
      technicalDepth: 98
    },
    features: ['3D Rendering', 'Physics Engine', 'Audio System', 'Scripting'],
    deploymentOptions: ['Native Build', 'Steam', 'Console Platforms'],
    battleStats: {
      attack: 98,
      defense: 92,
      speed: 98,
      utility: 85
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-06-08',
    lastUpdated: '2025-01-21'
  },
  {
    id: 'dashed-007',
    name: 'DASHED',
    displayName: 'Dashboard Engine',
    category: 'majors',
    githubUrl: 'https://github.com/elicharlese/DASHED',
    description: 'Dynamic dashboard creation platform with drag-and-drop interface',
    techStack: ['Vue.js', 'D3.js', 'Node.js', 'Express', 'MongoDB'],
    complexity: 'complex',
    estimatedValue: 1900,
    rarity: 'epic',
    stats: {
      innovation: 85,
      scalability: 92,
      marketPotential: 95,
      technicalDepth: 78
    },
    features: ['Drag & Drop', 'Real-time Updates', 'Custom Widgets', 'Data Connectors'],
    deploymentOptions: ['Vercel', 'Netlify', 'AWS'],
    battleStats: {
      attack: 82,
      defense: 85,
      speed: 92,
      utility: 98
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-07-15',
    lastUpdated: '2025-01-17'
  },
  {
    id: 'gsl-008',
    name: 'GSL',
    displayName: 'Graphics Shader Library',
    category: 'majors',
    githubUrl: 'https://github.com/elicharlese/GSL',
    description: 'Comprehensive graphics shader library for modern rendering',
    techStack: ['GLSL', 'HLSL', 'JavaScript', 'WebGL', 'OpenGL'],
    complexity: 'complex',
    estimatedValue: 1600,
    rarity: 'rare',
    stats: {
      innovation: 92,
      scalability: 75,
      marketPotential: 68,
      technicalDepth: 95
    },
    features: ['Shader Library', 'Visual Editor', 'Performance Tools', 'Documentation'],
    deploymentOptions: ['NPM', 'GitHub Releases', 'Documentation Site'],
    battleStats: {
      attack: 88,
      defense: 70,
      speed: 85,
      utility: 82
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-08-22',
    lastUpdated: '2025-01-14'
  },

  // MINORS
  {
    id: 'lumos-009',
    name: 'Lumos',
    displayName: 'Lumos Lighting',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/Lumos',
    description: 'Smart lighting control system with IoT integration',
    techStack: ['Arduino', 'Python', 'React', 'MQTT', 'SQLite'],
    complexity: 'moderate',
    estimatedValue: 800,
    rarity: 'rare',
    stats: {
      innovation: 78,
      scalability: 65,
      marketPotential: 85,
      technicalDepth: 72
    },
    features: ['IoT Control', 'Mobile App', 'Voice Control', 'Scheduling'],
    deploymentOptions: ['Raspberry Pi', 'Local Network', 'Cloud Sync'],
    battleStats: {
      attack: 65,
      defense: 78,
      speed: 72,
      utility: 88
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-09-10',
    lastUpdated: '2025-01-12'
  },
  {
    id: 'banish-010',
    name: 'Banish Realm',
    displayName: 'Banish Realm Game',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/banish-realm',
    description: 'Fantasy RPG game with procedural generation',
    techStack: ['Unity', 'C#', 'JSON', 'SQLite'],
    complexity: 'moderate',
    estimatedValue: 950,
    rarity: 'rare',
    stats: {
      innovation: 82,
      scalability: 68,
      marketPotential: 78,
      technicalDepth: 75
    },
    features: ['Procedural Generation', 'Character System', 'Combat', 'Inventory'],
    deploymentOptions: ['Steam', 'Unity Cloud', 'Mobile Stores'],
    battleStats: {
      attack: 85,
      defense: 65,
      speed: 78,
      utility: 70
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-10-05',
    lastUpdated: '2025-01-10'
  },
  {
    id: 'bitcell-011',
    name: 'Bitcell',
    displayName: 'Bitcell Crypto',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/bitcell',
    description: 'Cryptocurrency portfolio tracker with advanced analytics',
    techStack: ['React', 'Node.js', 'WebSocket', 'Chart.js'],
    complexity: 'moderate',
    estimatedValue: 750,
    rarity: 'common',
    stats: {
      innovation: 72,
      scalability: 85,
      marketPotential: 88,
      technicalDepth: 68
    },
    features: ['Portfolio Tracking', 'Real-time Prices', 'Alerts', 'Analytics'],
    deploymentOptions: ['Vercel', 'Netlify', 'AWS'],
    battleStats: {
      attack: 68,
      defense: 72,
      speed: 88,
      utility: 85
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-11-12',
    lastUpdated: '2025-01-08'
  },

  // Continue with more minors...
  {
    id: 'dropics-012',
    name: 'Dropics',
    displayName: 'Dropics Image Tool',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/dropics',
    description: 'Drag-and-drop image processing and optimization tool',
    techStack: ['JavaScript', 'Canvas API', 'WebWorkers', 'IndexedDB'],
    complexity: 'simple',
    estimatedValue: 400,
    rarity: 'common',
    stats: {
      innovation: 65,
      scalability: 70,
      marketPotential: 75,
      technicalDepth: 58
    },
    features: ['Image Processing', 'Batch Operations', 'Format Conversion', 'Compression'],
    deploymentOptions: ['GitHub Pages', 'Netlify', 'CDN'],
    battleStats: {
      attack: 55,
      defense: 65,
      speed: 78,
      utility: 85
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-12-01',
    lastUpdated: '2025-01-06'
  },

  // MVPs - Creative Ecommerce Co
  {
    id: 'colorupload-013',
    name: 'ColorUpload',
    displayName: 'Color Upload Service',
    category: 'mvps',
    githubUrl: 'https://github.com/Creative-Ecommerce-Co/colorupload',
    description: 'Advanced color extraction and palette generation from images',
    techStack: ['Python', 'FastAPI', 'PIL', 'React', 'PostgreSQL'],
    complexity: 'moderate',
    estimatedValue: 1200,
    rarity: 'epic',
    stats: {
      innovation: 88,
      scalability: 78,
      marketPotential: 85,
      technicalDepth: 82
    },
    features: ['Color Extraction', 'Palette Generation', 'API Service', 'Batch Processing'],
    deploymentOptions: ['Railway', 'Heroku', 'AWS Lambda'],
    battleStats: {
      attack: 75,
      defense: 82,
      speed: 85,
      utility: 92
    },
    isPublicForTrading: true,
    owner: 'Creative-Ecommerce-Co',
    createdAt: '2024-01-20',
    lastUpdated: '2025-01-15'
  },

  // Continue with more repository cards...
  // This is a sample of the structure - the full list would include all 48 repositories
]

// Helper functions for repository cards
export const getRepositoriesByCategory = (category: 'majors' | 'minors' | 'mvps') => {
  return ELICHARLESE_REPO_CARDS.filter(repo => repo.category === category)
}

export const getRepositoryById = (id: string) => {
  return ELICHARLESE_REPO_CARDS.find(repo => repo.id === id)
}

export const getRepositoriesByRarity = (rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic') => {
  return ELICHARLESE_REPO_CARDS.filter(repo => repo.rarity === rarity)
}

export const getPublicTradingRepositories = () => {
  return ELICHARLESE_REPO_CARDS.filter(repo => repo.isPublicForTrading)
}

export const calculateTotalPortfolioValue = () => {
  return ELICHARLESE_REPO_CARDS.reduce((total, repo) => total + repo.estimatedValue, 0)
}
