import React from 'react';
import '../styles/GlobalErrorBanner.css';

const GlobalErrorBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="global-error-banner" role="alert">
      <div className="global-error-content">
        <span className="global-error-icon">⚠</span>
        <div className="global-error-message">{message}</div>
        <button className="global-error-close" onClick={onClose} aria-label="Cerrar mensaje">×</button>
      </div>
    </div>
  );
};

export default GlobalErrorBanner;
