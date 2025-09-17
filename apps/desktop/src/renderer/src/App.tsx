import React, { useEffect } from 'react';
import { LandingPage } from '@ece-platform/shared-ui';
import TitleBar from './components/TitleBar';
import './types/electron.d.ts';
import './styles/App.css';

function App() {
  const handleEnterPlatform = () => {
    window.electronAPI?.openWebApp();
  };

  const handleViewPricing = () => {
    window.electronAPI?.openWebApp();
  };

  useEffect(() => {
    console.log('ECE M&A Trading Platform Desktop initialized');
  }, []);

  return (
    <div className="desktop-app">
      <TitleBar />
      <div className="main-content">
        <LandingPage 
          platform="desktop"
          onEnterPlatform={handleEnterPlatform}
          onViewPricing={handleViewPricing}
        />
      </div>
    </div>
  );
}

export default App;
