import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  CreditCard, 
  Store, 
  Swords, 
  TrendingUp, 
  Wallet, 
  PieChart, 
  Settings,
  ExternalLink,
  Rocket
} from 'lucide-react';
import { Button } from './components/Button';
import TitleBar from './components/TitleBar';
import './types/electron.d.ts';
import './styles/App.css';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path?: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'cards', label: 'My Collection', icon: CreditCard, path: '/app/profile' },
  { id: 'marketplace', label: 'M&A Marketplace', icon: Store, path: '/marketplace' },
  { id: 'battles', label: 'M&A Battles', icon: Swords, path: '/marketplace?tab=battles' },
  { id: 'prediction', label: 'Prediction Markets', icon: TrendingUp, path: '/marketplace?tab=betting' },
  { id: 'wallet', label: 'Crypto Wallet', icon: Wallet, path: '/admin/crypto' },
  { id: 'portfolio', label: 'Portfolio', icon: PieChart, path: '/portfolio' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/app/profile' },
];

const stats = [
  { label: 'Active Strategists', value: '100K+' },
  { label: 'Cards Traded', value: '1M+' },
  { label: 'Total Volume', value: '$50M+' },
  { label: 'Uptime', value: '99.9%' },
];

const features = [
  {
    icon: '🎯',
    title: 'Corporate Prediction Markets',
    description: 'Bet on real company performance metrics with Prize Picks style prediction markets for M&A strategists.',
    path: '/marketplace?tab=betting',
    action: '🎲 Start Predicting'
  },
  {
    icon: '🏛️',
    title: 'M&A Card Auctions', 
    description: 'Bid on company cards with Webull-style analytics and real-time M&A-focused trading.',
    path: '/marketplace?tab=auctions',
    action: '📈 View Auctions'
  },
  {
    icon: '⚔️',
    title: 'Strategic M&A Battles',
    description: 'Tinder-style company matching for epic merger & acquisition battles between corporate strategists.',
    path: '/marketplace?tab=battles',
    action: '🗡️ Enter Battle'
  },
  {
    icon: '💎',
    title: 'Crypto Payments',
    description: 'Trade with ECE Tokens, connect MetaMask, and manage your crypto wallet with multi-sig security.',
    path: '/admin/crypto',
    action: '💰 Manage Wallet'
  },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const handleNavClick = (item: NavigationItem) => {
    setActiveTab(item.id);
    if (item.path) {
      window.electronAPI?.openWebApp();
    }
  };

  const handleFeatureClick = () => {
    window.electronAPI?.openWebApp();
  };

  const handleLaunchPlatform = () => {
    window.electronAPI?.openWebApp();
  };

  useEffect(() => {
    console.log('ECE M&A Trading Platform Desktop initialized');
  }, []);

  return (
    <div className="desktop-app">
      <TitleBar />
      
      <div className="main-content">
        <div className="sidebar">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </motion.div>
            );
          })}
        </div>
        
        <div className="content-area">
          <motion.div 
            className="welcome-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="welcome-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Master M&A Battles
            </motion.h1>
            
            <motion.p 
              className="welcome-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The World&apos;s First M&A-Focused Trading Card Platform
            </motion.p>
            
            <motion.div 
              className="stats-bar"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label} 
                  className="stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="features-grid"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="glass-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div className="card-icon">{feature.icon}</div>
                  <div className="card-title">{feature.title}</div>
                  <div className="card-description">{feature.description}</div>
                  <Button
                    onClick={handleFeatureClick}
                    className="btn-primary"
                    size="sm"
                  >
                    {feature.action} <ExternalLink size={16} />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <Button
                onClick={handleLaunchPlatform}
                className="launch-button"
                size="lg"
              >
                <Rocket size={20} />
                Launch Full Platform
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;
