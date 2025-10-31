import React from 'react';

const Avatar = ({ src, alt = 'User', size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-32 h-32',
  };

  return (
    <img
      src={src || 'https://via.placeholder.com/150?text=User'}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover border-2 border-gray-200 ${className}`}
    />
  );
};

export default Avatar;
