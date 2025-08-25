import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
  rounded?: boolean;
  animate?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  count = 1,
  height = 'h-4',
  width = 'w-full',
  rounded = true,
  animate = true
}) => {
  const skeletonClass = `
    ${height} ${width} 
    ${rounded ? 'rounded-lg' : ''} 
    ${animate ? 'skeleton' : 'bg-gray-200 dark:bg-gray-700'}
    ${className}
  `;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClass} />
      ))}
    </>
  );
};

export default LoadingSkeleton;