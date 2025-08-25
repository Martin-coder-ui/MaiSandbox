import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  float?: boolean;
  tilt?: boolean;
  scale?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  borderGradient?: boolean;
  glassMorphism?: boolean;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  onClick,
  className = '',
  hover = true,
  glow = false,
  float = false,
  tilt = false,
  scale = true,
  shadow = 'md',
  borderGradient = false,
  glassMorphism = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const getTiltStyle = () => {
    if (!tilt || !isHovered) return {};
    
    const { x, y } = mousePosition;
    const centerX = 150; // Approximate card center
    const centerY = 100;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
    };
  };

  const baseClasses = `
    bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
    transition-all duration-300 ease-out transform-gpu
    ${shadow === 'sm' ? 'shadow-sm' : ''}
    ${shadow === 'md' ? 'shadow-md' : ''}
    ${shadow === 'lg' ? 'shadow-lg' : ''}
    ${shadow === 'xl' ? 'shadow-xl' : ''}
    ${shadow === '2xl' ? 'shadow-2xl' : ''}
    ${shadow === '3xl' ? 'shadow-3xl' : ''}
    ${hover ? 'hover:shadow-xl' : ''}
    ${scale && hover ? 'hover:scale-105' : ''}
    ${glow ? 'hover:shadow-glow' : ''}
    ${float ? 'float' : ''}
    ${glassMorphism ? 'glass' : ''}
    ${borderGradient ? 'border-gradient' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div
      className={baseClasses}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={getTiltStyle()}
    >
      {borderGradient && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 p-[1px]">
          <div className="h-full w-full rounded-xl bg-white dark:bg-gray-800">
            {children}
          </div>
        </div>
      )}
      {!borderGradient && children}
    </div>
  );
};

export default InteractiveCard;