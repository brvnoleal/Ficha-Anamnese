import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Contrast, AArrowUp, AArrowDown } from 'lucide-react';

export const AccessibilityControls: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    // Load saved preferences
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize') || '100');
    
    setHighContrast(savedContrast);
    setFontSize(savedFontSize);
    
    if (savedContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    document.documentElement.style.fontSize = `${savedFontSize}%`;
  }, []);

  const toggleContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', String(newValue));
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const adjustFontSize = (delta: number) => {
    const newSize = Math.min(150, Math.max(80, fontSize + delta));
    setFontSize(newSize);
    localStorage.setItem('fontSize', String(newSize));
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  return (
    <div className="fixed top-12 right-4 z-50 flex gap-1.5">
      <motion.button
        onClick={toggleContrast}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`
          w-5 h-5 rounded-full flex items-center justify-center
          transition-all duration-200 shadow-sm
          ${highContrast 
            ? 'opacity-100 ring-1 ring-primary ring-offset-1 bg-white' 
            : 'opacity-40 bg-white/80 hover:opacity-70'
          }
        `}
        title="Alto Contraste"
        aria-label="Alternar alto contraste"
      >
        <Contrast className="w-3 h-3 text-foreground" />
      </motion.button>

      <motion.button
        onClick={() => adjustFontSize(10)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`
          w-5 h-5 rounded-full flex items-center justify-center
          transition-all duration-200 shadow-sm
          ${fontSize > 100 
            ? 'opacity-100 ring-1 ring-primary ring-offset-1 bg-white' 
            : 'opacity-40 bg-white/80 hover:opacity-70'
          }
        `}
        title="Aumentar Fonte"
        aria-label="Aumentar tamanho da fonte"
        disabled={fontSize >= 150}
      >
        <AArrowUp className="w-3 h-3 text-foreground" />
      </motion.button>

      <motion.button
        onClick={() => adjustFontSize(-10)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`
          w-5 h-5 rounded-full flex items-center justify-center
          transition-all duration-200 shadow-sm
          ${fontSize < 100 
            ? 'opacity-100 ring-1 ring-primary ring-offset-1 bg-white' 
            : 'opacity-40 bg-white/80 hover:opacity-70'
          }
        `}
        title="Diminuir Fonte"
        aria-label="Diminuir tamanho da fonte"
        disabled={fontSize <= 80}
      >
        <AArrowDown className="w-3 h-3 text-foreground" />
      </motion.button>
    </div>
  );
};
