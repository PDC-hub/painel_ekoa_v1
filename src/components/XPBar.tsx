import React from 'react';
import { motion } from 'framer-motion';

interface XPBarProps {
  current: number;
  max: number;
  level: number;
  showLevel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({
  current,
  max,
  level,
  showLevel = true,
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  
  const sizeClasses = {
    sm: { bar: 'h-3', text: 'text-xs', level: 'text-sm px-2 py-0.5' },
    md: { bar: 'h-5', text: 'text-sm', level: 'text-base px-3 py-1' },
    lg: { bar: 'h-7', text: 'text-base', level: 'text-lg px-4 py-1.5' },
  };
  
  const sizes = sizeClasses[size];
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLevel && (
        <div className={`badge-level ${sizes.level} flex-shrink-0`}>
          Nv. {level}
        </div>
      )}
      
      <div className="flex-1 relative">
        {/* XP Bar Container */}
        <div className={`xp-bar ${sizes.bar}`}>
          {/* XP Fill */}
          <motion.div
            className="xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          
          {/* Pattern overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 8px,
                rgba(0,0,0,0.3) 8px,
                rgba(0,0,0,0.3) 16px
              )`,
            }}
          />
        </div>
        
        {/* XP Text */}
        <div className={`absolute inset-0 flex items-center justify-center ${sizes.text} font-mono font-bold text-[#1A1510]`}>
          <span className="drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
            {current} / {max} XP
          </span>
        </div>
      </div>
    </div>
  );
};

interface XPGainAnimationProps {
  amount: number;
  onComplete?: () => void;
}

export const XPGainAnimation: React.FC<XPGainAnimationProps> = ({ amount, onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.5 }}
      animate={{ opacity: 1, y: -40, scale: 1.2 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="fixed pointer-events-none z-50"
      style={{ left: '50%', top: '50%' }}
    >
      <div className="flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#B8860B] px-4 py-2 rounded-full border-2 border-white shadow-lg">
        <span className="text-2xl">✨</span>
        <span className="text-[#1A1510] font-bold text-xl font-mono">+{amount} XP</span>
        <span className="text-2xl">✨</span>
      </div>
      
      {/* Particle effects */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#FFD700]"
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: Math.cos((i * Math.PI) / 4) * 60,
            y: Math.sin((i * Math.PI) / 4) * 60,
            opacity: 0,
          }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      ))}
    </motion.div>
  );
};

interface LevelUpAnimationProps {
  level: number;
  onComplete?: () => void;
}

export const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({ level, onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.5, ease: 'backOut' }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ rotate: -10 }}
        animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center"
      >
        {/* Glowing background */}
        <div className="absolute inset-0 bg-gradient-radial from-[#FFD700]/30 via-transparent to-transparent blur-3xl" />
        
        {/* Level up badge */}
        <div className="relative">
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(255, 215, 0, 0.4)',
                '0 0 60px rgba(255, 215, 0, 0.8)',
                '0 0 20px rgba(255, 215, 0, 0.4)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block bg-gradient-to-br from-[#B87333] via-[#D4AF37] to-[#FFD700] px-12 py-8 rounded-2xl border-4 border-[#F5F0E8]"
          >
            <div className="text-[#1A1510] font-bold text-lg uppercase tracking-widest mb-2">
              Nível Alcançado!
            </div>
            <div className="text-7xl font-bold text-gradient-gold drop-shadow-lg">
              {level}
            </div>
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-8 -left-8 text-4xl"
          >
            ⚙️
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-8 -right-8 text-4xl"
          >
            ⚙️
          </motion.div>
          
          {/* Stars */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="absolute text-3xl"
              style={{
                top: `${20 + Math.sin((i * Math.PI) / 3) * 80}%`,
                left: `${20 + Math.cos((i * Math.PI) / 3) * 80}%`,
              }}
            >
              ⭐
            </motion.div>
          ))}
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-[#F5F0E8] text-xl"
        >
          Parabéns! Você desbloqueou novas habilidades!
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
