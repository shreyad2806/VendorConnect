import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: '',
    md: '',
    lg: '',
    xl: ''
  };

  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`}>
      <div className={`spinner-border text-primary ${size === 'sm' ? 'spinner-border-sm' : ''}`} role="status" style={{width: size === 'sm' ? '1.5rem' : size === 'lg' ? '3rem' : size === 'xl' ? '4rem' : '2rem', height: size === 'sm' ? '1.5rem' : size === 'lg' ? '3rem' : size === 'xl' ? '4rem' : '2rem'}}>
  <span className="visually-hidden">Loading...</span>
</div>
    </div>
  );
};

export default LoadingSpinner;
