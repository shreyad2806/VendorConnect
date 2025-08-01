import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', text = 'Loading...' }) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { width: '1.5rem', height: '1.5rem' };
      case 'lg':
        return { width: '3rem', height: '3rem' };
      case 'xl':
        return { width: '4rem', height: '4rem' };
      default:
        return { width: '2rem', height: '2rem' };
    }
  };

  return (
    <div className={`d-flex flex-column align-items-center justify-content-center ${className}`}>
      <div 
        className="spinner-border"
        role="status"
        style={{
          ...getSizeStyles(),
          borderWidth: '3px',
          borderColor: 'transparent',
          borderTopColor: '#667eea',
          borderRightColor: '#764ba2',
          animation: 'spin 1s linear infinite'
        }}
      >
        <span className="visually-hidden">{text}</span>
      </div>
      {text && (
        <div 
          className="mt-3 fw-medium"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem'
          }}
        >
          {text}
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Full page loading overlay component
export const LoadingOverlay = ({ text = 'Loading...' }) => {
  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999
      }}
    >
      <div 
        className="p-4 rounded-4 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minWidth: '200px'
        }}
      >
        <LoadingSpinner size="lg" className="text-white" text="" />
        <div className="text-center mt-3 text-white fw-medium">
          {text}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
