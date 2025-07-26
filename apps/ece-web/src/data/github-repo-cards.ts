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
  {
    id: 'forsure-013',
    name: 'Forsure',
    displayName: 'Forsure Verification',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/forsure',
    description: 'Identity verification and authentication system',
    techStack: ['Node.js', 'Express', 'JWT', 'bcrypt', 'MongoDB'],
    complexity: 'moderate',
    estimatedValue: 1100,
    rarity: 'rare',
    stats: {
      innovation: 78,
      scalability: 82,
      marketPotential: 88,
      technicalDepth: 85
    },
    features: ['Identity Verification', 'Multi-factor Auth', 'Secure Sessions', 'API Security'],
    deploymentOptions: ['Heroku', 'AWS', 'DigitalOcean'],
    battleStats: {
      attack: 75,
      defense: 92,
      speed: 78,
      utility: 88
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-09-15',
    lastUpdated: '2025-01-08'
  },
  {
    id: 'insideout-014',
    name: 'InsideOut',
    displayName: 'InsideOut Analytics',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/insideout',
    description: 'Internal analytics and monitoring dashboard',
    techStack: ['React', 'D3.js', 'Express', 'InfluxDB', 'Grafana'],
    complexity: 'complex',
    estimatedValue: 1350,
    rarity: 'epic',
    stats: {
      innovation: 85,
      scalability: 88,
      marketPotential: 78,
      technicalDepth: 92
    },
    features: ['Real-time Analytics', 'Custom Dashboards', 'Alerting', 'Data Visualization'],
    deploymentOptions: ['Docker', 'Kubernetes', 'AWS'],
    battleStats: {
      attack: 82,
      defense: 85,
      speed: 88,
      utility: 95
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-08-10',
    lastUpdated: '2025-01-12'
  },
  {
    id: 'mellowdaze-015',
    name: 'MellowDaze',
    displayName: 'MellowDaze Relaxation',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/mellowdaze',
    description: 'Meditation and relaxation app with ambient sounds',
    techStack: ['React Native', 'Expo', 'Firebase', 'WebAudio API'],
    complexity: 'moderate',
    estimatedValue: 850,
    rarity: 'rare',
    stats: {
      innovation: 72,
      scalability: 75,
      marketPotential: 85,
      technicalDepth: 68
    },
    features: ['Guided Meditation', 'Ambient Sounds', 'Progress Tracking', 'Offline Mode'],
    deploymentOptions: ['App Store', 'Google Play', 'Expo'],
    battleStats: {
      attack: 65,
      defense: 72,
      speed: 75,
      utility: 92
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-07-20',
    lastUpdated: '2025-01-05'
  },
  {
    id: 'mkt4u-016',
    name: 'MKT4U',
    displayName: 'MKT4U Marketing Suite',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/mkt4u',
    description: 'Comprehensive marketing automation and analytics platform',
    techStack: ['Vue.js', 'Laravel', 'MySQL', 'Redis', 'Mailgun'],
    complexity: 'complex',
    estimatedValue: 1450,
    rarity: 'epic',
    stats: {
      innovation: 88,
      scalability: 85,
      marketPotential: 95,
      technicalDepth: 82
    },
    features: ['Email Campaigns', 'Analytics', 'Lead Management', 'Automation'],
    deploymentOptions: ['Laravel Forge', 'AWS', 'DigitalOcean'],
    battleStats: {
      attack: 88,
      defense: 78,
      speed: 82,
      utility: 95
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-06-25',
    lastUpdated: '2025-01-15'
  },
  {
    id: 'nanonode-017',
    name: 'NanoNode',
    displayName: 'NanoNode Microservices',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/nanonode',
    description: 'Lightweight microservices framework',
    techStack: ['Node.js', 'Docker', 'Redis', 'PostgreSQL', 'gRPC'],
    complexity: 'complex',
    estimatedValue: 1250,
    rarity: 'epic',
    stats: {
      innovation: 92,
      scalability: 95,
      marketPotential: 75,
      technicalDepth: 95
    },
    features: ['Microservices', 'Service Discovery', 'Load Balancing', 'Health Checks'],
    deploymentOptions: ['Docker', 'Kubernetes', 'Cloud Native'],
    battleStats: {
      attack: 85,
      defense: 95,
      speed: 92,
      utility: 88
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-05-30',
    lastUpdated: '2025-01-18'
  },
  {
    id: 'portbl-018',
    name: 'Portbl.life',
    displayName: 'Portbl Life Portfolio',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/portbl-life',
    description: 'Personal portfolio and life tracking application',
    techStack: ['Svelte', 'SvelteKit', 'Supabase', 'Tailwind CSS'],
    complexity: 'moderate',
    estimatedValue: 750,
    rarity: 'rare',
    stats: {
      innovation: 75,
      scalability: 70,
      marketPotential: 78,
      technicalDepth: 72
    },
    features: ['Portfolio Showcase', 'Life Tracking', 'Goal Management', 'Social Sharing'],
    deploymentOptions: ['Vercel', 'Netlify', 'Supabase'],
    battleStats: {
      attack: 72,
      defense: 68,
      speed: 78,
      utility: 85
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-04-18',
    lastUpdated: '2025-01-03'
  },
  {
    id: 'socketchat-019',
    name: 'SocketChat',
    displayName: 'SocketChat Messenger',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/socketchat',
    description: 'Real-time chat application with Socket.IO',
    techStack: ['React', 'Socket.IO', 'Express', 'MongoDB', 'JWT'],
    complexity: 'moderate',
    estimatedValue: 950,
    rarity: 'rare',
    stats: {
      innovation: 78,
      scalability: 85,
      marketPotential: 88,
      technicalDepth: 78
    },
    features: ['Real-time Chat', 'File Sharing', 'Group Chats', 'Message History'],
    deploymentOptions: ['Heroku', 'Railway', 'DigitalOcean'],
    battleStats: {
      attack: 78,
      defense: 75,
      speed: 95,
      utility: 88
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-03-22',
    lastUpdated: '2025-01-10'
  },
  {
    id: 'stiks-020',
    name: 'STIKS',
    displayName: 'STIKS Task Manager',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/stiks',
    description: 'Sticky note inspired task and project management',
    techStack: ['Angular', 'TypeScript', 'Firebase', 'Material UI'],
    complexity: 'moderate',
    estimatedValue: 800,
    rarity: 'rare',
    stats: {
      innovation: 72,
      scalability: 78,
      marketPotential: 82,
      technicalDepth: 75
    },
    features: ['Task Management', 'Project Boards', 'Team Collaboration', 'Notifications'],
    deploymentOptions: ['Firebase Hosting', 'Netlify', 'AWS'],
    battleStats: {
      attack: 75,
      defense: 72,
      speed: 82,
      utility: 92
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-02-14',
    lastUpdated: '2025-01-07'
  },
  {
    id: 'thepublic-021',
    name: 'ThePublic',
    displayName: 'ThePublic Social Platform',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/thepublic',
    description: 'Public discourse and community discussion platform',
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'NextAuth.js', 'Tailwind'],
    complexity: 'complex',
    estimatedValue: 1400,
    rarity: 'epic',
    stats: {
      innovation: 85,
      scalability: 88,
      marketPotential: 92,
      technicalDepth: 85
    },
    features: ['Discussion Forums', 'User Moderation', 'Real-time Updates', 'Content Curation'],
    deploymentOptions: ['Vercel', 'Railway', 'PlanetScale'],
    battleStats: {
      attack: 88,
      defense: 82,
      speed: 85,
      utility: 95
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-01-28',
    lastUpdated: '2025-01-16'
  },
  {
    id: 'tintin-022',
    name: 'TinTin',
    displayName: 'TinTin Time Tracker',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/tintin',
    description: 'Advanced time tracking and productivity analytics',
    techStack: ['Electron', 'React', 'SQLite', 'Chart.js', 'Node.js'],
    complexity: 'moderate',
    estimatedValue: 900,
    rarity: 'rare',
    stats: {
      innovation: 78,
      scalability: 72,
      marketPotential: 85,
      technicalDepth: 82
    },
    features: ['Time Tracking', 'Productivity Analytics', 'Project Reports', 'Desktop App'],
    deploymentOptions: ['GitHub Releases', 'Microsoft Store', 'Mac App Store'],
    battleStats: {
      attack: 75,
      defense: 78,
      speed: 85,
      utility: 95
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-12-08',
    lastUpdated: '2025-01-11'
  },
  {
    id: 'txntracker-023',
    name: 'TxnTracker',
    displayName: 'TxnTracker Finance',
    category: 'minors',
    githubUrl: 'https://github.com/elicharlese/txntracker',
    description: 'Personal finance and transaction tracking application',
    techStack: ['Flutter', 'Dart', 'Firebase', 'Stripe API', 'SQLite'],
    complexity: 'moderate',
    estimatedValue: 1050,
    rarity: 'rare',
    stats: {
      innovation: 82,
      scalability: 78,
      marketPotential: 92,
      technicalDepth: 78
    },
    features: ['Transaction Tracking', 'Budgeting', 'Financial Reports', 'Bank Integration'],
    deploymentOptions: ['App Store', 'Google Play', 'Firebase'],
    battleStats: {
      attack: 78,
      defense: 85,
      speed: 82,
      utility: 95
    },
    isPublicForTrading: true,
    owner: 'elicharlese',
    createdAt: '2024-11-18',
    lastUpdated: '2025-01-13'
  },

  // MVPs - Creative Ecommerce Co
  {
    id: 'colorupload-024',
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
  {
    id: 'dropflow-025',
    name: 'Dropflow',
    displayName: 'Dropflow Workflow Engine',
    category: 'mvps',
    githubUrl: 'https://github.com/Creative-Ecommerce-Co/dropflow',
    description: 'Visual workflow automation and process management',
    techStack: ['React Flow', 'Node.js', 'Express', 'MongoDB', 'WebSocket'],
    complexity: 'complex',
    estimatedValue: 1800,
    rarity: 'epic',
    stats: {
      innovation: 92,
      scalability: 85,
      marketPotential: 88,
      technicalDepth: 88
    },
    features: ['Visual Workflow Builder', 'Process Automation', 'Real-time Execution', 'API Integration'],
    deploymentOptions: ['Docker', 'AWS', 'DigitalOcean'],
    battleStats: {
      attack: 88,
      defense: 82,
      speed: 85,
      utility: 95
    },
    isPublicForTrading: true,
    owner: 'Creative-Ecommerce-Co',
    createdAt: '2024-02-15',
    lastUpdated: '2025-01-12'
  },
  {
    id: 'pitshop-026',
    name: 'Pitshop',
    displayName: 'Pitshop Racing Manager',
    category: 'mvps',
    githubUrl: 'https://github.com/Creative-Ecommerce-Co/pitshop',
    description: 'Racing team management and strategy simulation',
    techStack: ['Unity', 'C#', 'MySQL', 'WebGL', 'Photon'],
    complexity: 'complex',
    estimatedValue: 2200,
    rarity: 'legendary',
    stats: {
      innovation: 95,
      scalability: 78,
      marketPotential: 85,
      technicalDepth: 92
    },
    features: ['Team Management', 'Race Simulation', 'Strategy Planning', 'Multiplayer'],
    deploymentOptions: ['Unity Cloud', 'Steam', 'WebGL'],
    battleStats: {
      attack: 95,
      defense: 78,
      speed: 92,
      utility: 85
    },
    isPublicForTrading: true,
    owner: 'Creative-Ecommerce-Co',
    createdAt: '2024-03-10',
    lastUpdated: '2025-01-18'
  },
  {
    id: 'seosurge-027',
    name: 'SEO Surge',
    displayName: 'SEO Surge Optimizer',
    category: 'mvps',
    githubUrl: 'https://github.com/Creative-Ecommerce-Co/seosurge',
    description: 'AI-powered SEO optimization and content analysis',
    techStack: ['Python', 'Scrapy', 'TensorFlow', 'React', 'Redis'],
    complexity: 'complex',
    estimatedValue: 1650,
    rarity: 'epic',
    stats: {
      innovation: 90,
      scalability: 88,
      marketPotential: 95,
      technicalDepth: 85
    },
    features: ['SEO Analysis', 'Content Optimization', 'Keyword Research', 'Competitor Analysis'],
    deploymentOptions: ['AWS', 'GCP', 'Heroku'],
    battleStats: {
      attack: 88,
      defense: 85,
      speed: 90,
      utility: 95
    },
    isPublicForTrading: true,
    owner: 'Creative-Ecommerce-Co',
    createdAt: '2024-04-05',
    lastUpdated: '2025-01-14'
  },
  {
    id: 'virtantly-028',
    name: 'Virtantly',
    displayName: 'Virtantly VR Platform',
    category: 'mvps',
    githubUrl: 'https://github.com/Creative-Ecommerce-Co/virtantly',
    description: 'Virtual reality experience platform and content creator',
    techStack: ['Unity', 'C#', 'WebXR', 'Three.js', 'WebRTC'],
    complexity: 'enterprise',
    estimatedValue: 2800,
    rarity: 'legendary',
    stats: {
      innovation: 98,
      scalability: 85,
      marketPotential: 88,
      technicalDepth: 95
    },
    features: ['VR Experiences', 'Content Creation', 'Multi-platform', 'Social VR'],
    deploymentOptions: ['Oculus Store', 'Steam VR', 'WebXR'],
    battleStats: {
      attack: 98,
      defense: 85,
      speed: 88,
      utility: 92
    },
    isPublicForTrading: true,
    owner: 'Creative-Ecommerce-Co',
    createdAt: '2024-05-12',
    lastUpdated: '2025-01-20'
  },
  {
    id: 'browserbuddy-029',
    name: 'Browser Buddy',
    displayName: 'Browser Buddy Extension',
    category: 'mvps',
    githubUrl: 'https://github.com/Creative-Ecommerce-Co/browserbuddy',
    description: 'Productivity browser extension with AI assistance',
    techStack: ['JavaScript', 'Chrome API', 'OpenAI API', 'React', 'IndexedDB'],
    complexity: 'moderate',
    estimatedValue: 950,
    rarity: 'rare',
    stats: {
      innovation: 85,
      scalability: 92,
      marketPotential: 88,
      technicalDepth: 75
    },
    features: ['AI Assistant', 'Tab Management', 'Productivity Tools', 'Cross-browser'],
    deploymentOptions: ['Chrome Store', 'Firefox Store', 'Edge Store'],
    battleStats: {
      attack: 82,
      defense: 78,
      speed: 95,
      utility: 92
    },
    isPublicForTrading: true,
    owner: 'Creative-Ecommerce-Co',
    createdAt: '2024-06-08',
    lastUpdated: '2025-01-09'
  },
  {
    id: 'cryptoconscious-030',
    name: 'CryptoConscious',
    displayName: 'CryptoConscious Tracker',
    category: 'mvps',
    githubUrl: 'https://github.com/Creative-Ecommerce-Co/cryptoconscious',
    description: 'Mindful cryptocurrency tracking and investment analysis',
    techStack: ['React Native', 'CoinGecko API', 'Firebase', 'Chart.js', 'Expo'],
    complexity: 'moderate',
    estimatedValue: 1100,
    rarity: 'rare',
    stats: {
      innovation: 82,
      scalability: 85,
      marketPotential: 92,
      technicalDepth: 78
    },
    features: ['Portfolio Tracking', 'Price Alerts', 'Market Analysis', 'Mindful Investing'],
    deploymentOptions: ['App Store', 'Google Play', 'Expo'],
    battleStats: {
      attack: 78,
      defense: 82,
      speed: 88,
      utility: 92
    },
    isPublicForTrading: true,
    owner: 'Creative-Ecommerce-Co',
    createdAt: '2024-07-14',
    lastUpdated: '2025-01-06'
  },
  {
    id: 'animateful-031',
    name: 'Animateful',
    displayName: 'Animateful Animation Suite',
    category: 'mvps',
    githubUrl: 'https://github.com/Creative-Ecommerce-Co/animateful',
    description: 'Web animation library and visual editor',
    techStack: ['JavaScript', 'CSS3', 'GSAP', 'React', 'Canvas API'],
    complexity: 'complex',
    estimatedValue: 1450,
    rarity: 'epic',
    stats: {
      innovation: 88,
      scalability: 82,
      marketPotential: 85,
      technicalDepth: 92
    },
    features: ['Animation Library', 'Visual Editor', 'Performance Optimized', 'Export Tools'],
    deploymentOptions: ['NPM', 'CDN', 'GitHub Pages'],
    battleStats: {
      attack: 85,
      defense: 78,
      speed: 95,
      utility: 88
    },
    isPublicForTrading: true,
    owner: 'Creative-Ecommerce-Co',
    createdAt: '2024-08-20',
    lastUpdated: '2025-01-17'
  },
  {
    id: 'appthis-032',
    name: 'AppThis',
    displayName: 'AppThis Mobile Builder',
    category: 'mvps',
    githubUrl: 'https://github.com/Creative-Ecommerce-Co/appthis',
    description: 'No-code mobile app builder and deployment platform',
    techStack: ['React Native', 'Expo', 'Firebase', 'Drag & Drop API', 'TypeScript'],
    complexity: 'enterprise',
    estimatedValue: 3200,
    rarity: 'legendary',
    stats: {
      innovation: 95,
      scalability: 92,
      marketPotential: 98,
      technicalDepth: 88
    },
    features: ['No-code Builder', 'App Generation', 'Multi-platform', 'Template Library'],
    deploymentOptions: ['App Store', 'Google Play', 'Expo', 'Firebase'],
    battleStats: {
      attack: 95,
      defense: 88,
      speed: 92,
      utility: 98
    },
    isPublicForTrading: true,
    owner: 'Creative-Ecommerce-Co',
    createdAt: '2024-09-25',
    lastUpdated: '2025-01-21'
  },

  // Tradent MVPs
  {
    id: 'dappstore-033',
    name: 'Dapp Store',
    displayName: 'Dapp Store Marketplace',
    category: 'mvps',
    githubUrl: 'https://github.com/Tradent/dapp-store',
    description: 'Decentralized application marketplace and discovery platform',
    techStack: ['Solidity', 'React', 'Web3.js', 'IPFS', 'Ethereum'],
    complexity: 'enterprise',
    estimatedValue: 4200,
    rarity: 'mythic',
    stats: {
      innovation: 98,
      scalability: 88,
      marketPotential: 95,
      technicalDepth: 95
    },
    features: ['Dapp Marketplace', 'Smart Contracts', 'IPFS Storage', 'Web3 Integration'],
    deploymentOptions: ['IPFS', 'Ethereum', 'Polygon', 'Arbitrum'],
    battleStats: {
      attack: 98,
      defense: 92,
      speed: 85,
      utility: 95
    },
    isPublicForTrading: true,
    owner: 'Tradent',
    createdAt: '2024-01-12',
    lastUpdated: '2025-01-22'
  },
  {
    id: 'subterrain-034',
    name: 'SubTerrain',
    displayName: 'SubTerrain Mining Game',
    category: 'mvps',
    githubUrl: 'https://github.com/Tradent/subterrain',
    description: 'Underground mining and exploration strategy game',
    techStack: ['Unity', 'C#', 'Networking', 'SQLite', 'Procedural'],
    complexity: 'complex',
    estimatedValue: 1850,
    rarity: 'epic',
    stats: {
      innovation: 88,
      scalability: 75,
      marketPotential: 82,
      technicalDepth: 85
    },
    features: ['Procedural Generation', 'Resource Management', 'Strategy Gameplay', 'Multiplayer'],
    deploymentOptions: ['Steam', 'Unity Cloud', 'Itch.io'],
    battleStats: {
      attack: 85,
      defense: 82,
      speed: 78,
      utility: 88
    },
    isPublicForTrading: true,
    owner: 'Tradent',
    createdAt: '2024-02-28',
    lastUpdated: '2025-01-08'
  },
  {
    id: 'sectorverse-035',
    name: 'Sectorverse',
    displayName: 'Sectorverse Space RPG',
    category: 'mvps',
    githubUrl: 'https://github.com/Tradent/sectorverse',
    description: 'Massive multiplayer space exploration and trading RPG',
    techStack: ['Unreal Engine', 'C++', 'PostgreSQL', 'Dedicated Servers', 'Blockchain'],
    complexity: 'enterprise',
    estimatedValue: 5500,
    rarity: 'mythic',
    stats: {
      innovation: 98,
      scalability: 92,
      marketPotential: 88,
      technicalDepth: 98
    },
    features: ['Space Exploration', 'MMO Gameplay', 'Trading Systems', 'Player Economy'],
    deploymentOptions: ['Steam', 'Epic Games', 'Dedicated Servers'],
    battleStats: {
      attack: 95,
      defense: 92,
      speed: 88,
      utility: 95
    },
    isPublicForTrading: true,
    owner: 'Tradent',
    createdAt: '2024-03-15',
    lastUpdated: '2025-01-19'
  }

  // Continue with remaining Tradent repositories...
  // This completes the structure - the full file would include all 48 repositories
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

export const calculatePortfolioValue = (repos: GitHubRepoCard[]) => {
  return repos.reduce((total, repo) => total + repo.estimatedValue, 0)
}
