import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleToggle = () => {
    console.log('Toggle clicked, current isDarkMode:', isDarkMode);
    toggleTheme();
    console.log('After toggle, isDarkMode should be:', !isDarkMode);
  };

  return (
    <button 
      className="theme-toggle"
      onClick={handleToggle}
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <span className="theme-icon">
        {isDarkMode ? '☀️' : '🌙'}
      </span>
      <span className="theme-label">
        {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
      </span>
    </button>
  );
};

export default ThemeToggle;
