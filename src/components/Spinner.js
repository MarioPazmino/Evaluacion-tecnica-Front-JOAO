import React from 'react';
import '../styles/Spinner.css';

const Spinner = ({ size = 'md', ariaLabel = 'loading' }) => {
  const cls = `spinner spinner--${size}`;
  return (
    <span role="status" aria-live="polite" aria-label={ariaLabel} className={cls} />
  );
};

export default Spinner;
