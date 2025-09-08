import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Square, X } from 'lucide-react';

const TitleBar: React.FC = () => {
  const handleMinimize = () => {
    window.electronAPI?.windowMinimize();
  };

  const handleMaximize = () => {
    window.electronAPI?.windowMaximize();
  };

  const handleClose = () => {
    window.electronAPI?.closeWindow();
  };

  return (
    <div className="title-bar">
      <div className="title-bar-content">
        <h1 className="title-text">ECE M&A Trading Cards Platform</h1>
      </div>
      
      {process.platform !== 'darwin' && (
        <div className="window-controls">
          <motion.button
            className="window-control minimize"
            onClick={handleMinimize}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.9 }}
          >
            <Minus size={14} />
          </motion.button>
          
          <motion.button
            className="window-control maximize"
            onClick={handleMaximize}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.9 }}
          >
            <Square size={14} />
          </motion.button>
          
          <motion.button
            className="window-control close"
            onClick={handleClose}
            whileHover={{ backgroundColor: '#ff4444' }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={14} />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default TitleBar;
