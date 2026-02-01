import React from 'react';
import { motion } from 'framer-motion';

interface SteamPunkGearProps {
  size?: number;
  color?: string;
  speed?: number;
  reverse?: boolean;
  className?: string;
}

export const SteamPunkGear: React.FC<SteamPunkGearProps> = ({
  size = 60,
  color = '#B87333',
  speed = 10,
  reverse = false,
  className = '',
}) => {
  const teeth = 12;
  const innerTeeth = 8;
  
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {/* Outer gear teeth */}
      {Array.from({ length: teeth }).map((_, i) => (
        <rect
          key={`tooth-${i}`}
          x="45"
          y="2"
          width="10"
          height="15"
          fill={color}
          transform={`rotate(${i * (360 / teeth)} 50 50)`}
          rx="1"
        />
      ))}
      
      {/* Main gear body */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke={color}
        strokeWidth="8"
      />
      
      {/* Inner decorative ring */}
      <circle
        cx="50"
        cy="50"
        r="28"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.6"
      />
      
      {/* Inner gear teeth */}
      {Array.from({ length: innerTeeth }).map((_, i) => (
        <rect
          key={`inner-tooth-${i}`}
          x="47"
          y="22"
          width="6"
          height="10"
          fill={color}
          transform={`rotate(${i * (360 / innerTeeth)} 50 50)`}
          rx="1"
        />
      ))}
      
      {/* Center circle */}
      <circle
        cx="50"
        cy="50"
        r="12"
        fill={color}
      />
      
      {/* Center bolt */}
      <circle
        cx="50"
        cy="50"
        r="6"
        fill="#D4AF37"
      />
      
      {/* Bolt slots */}
      <rect x="48" y="44" width="4" height="12" fill={color} />
      <rect x="44" y="48" width="12" height="4" fill={color} />
      
      {/* Decorative screws */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = i * 90;
        const x = 50 + 20 * Math.cos((angle * Math.PI) / 180);
        const y = 50 + 20 * Math.sin((angle * Math.PI) / 180);
        return (
          <circle
            key={`screw-${i}`}
            cx={x}
            cy={y}
            r="3"
            fill="#D4AF37"
          />
        );
      })}
    </motion.svg>
  );
};

interface SteamPunkDecorationProps {
  className?: string;
}

export const SteamPunkDecoration: React.FC<SteamPunkDecorationProps> = ({ className = '' }) => {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      {/* Corner gears */}
      <SteamPunkGear
        size={80}
        color="#B87333"
        speed={20}
        className="absolute top-4 left-4 opacity-30"
      />
      <SteamPunkGear
        size={60}
        color="#D4AF37"
        speed={15}
        reverse
        className="absolute top-8 left-20 opacity-20"
      />
      <SteamPunkGear
        size={50}
        color="#8B4513"
        speed={25}
        className="absolute bottom-4 right-4 opacity-25"
      />
      <SteamPunkGear
        size={40}
        color="#B87333"
        speed={18}
        reverse
        className="absolute bottom-8 right-16 opacity-20"
      />
    </div>
  );
};

export const SteamPunkBorder: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Corner decorations */}
      <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]" />
      
      {/* Small gear decorations */}
      <SteamPunkGear size={24} color="#B87333" speed={30} className="absolute -top-3 left-1/4 opacity-40" />
      <SteamPunkGear size={20} color="#D4AF37" speed={25} reverse className="absolute -bottom-3 right-1/4 opacity-40" />
      
      {children}
    </div>
  );
};

export const SteamPunkDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-4 my-6 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#B87333] to-transparent" />
      <SteamPunkGear size={30} color="#B87333" speed={20} />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#B87333] to-transparent" />
    </div>
  );
};

export const SteamPunkFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Outer frame */}
      <div className="absolute inset-0 border-2 border-[#B87333] rounded-xl" />
      
      {/* Inner frame */}
      <div className="absolute inset-1 border border-[#D4AF37] rounded-lg opacity-50" />
      
      {/* Corner brackets */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />
      
      {/* Rivets */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#D4AF37]" />
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D4AF37]" />
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#D4AF37]" />
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#D4AF37]" />
      
      {/* Content */}
      <div className="relative p-6">
        {children}
      </div>
    </div>
  );
};
