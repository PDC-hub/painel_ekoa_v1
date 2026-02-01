import React from 'react';
import { motion } from 'framer-motion';
import type { GameItem, ItemRarity } from '@/types';
import { RARITY_COLORS, RARITY_NAMES } from '@/types';
import { Sparkles } from 'lucide-react';

interface ItemCardProps {
  item: GameItem;
  quantity?: number;
  equipped?: boolean;
  onClick?: () => void;
  onEquip?: () => void;
  onUnequip?: () => void;
  showActions?: boolean;
  className?: string;
}

const getRarityGlow = (rarity: ItemRarity): string => {
  const glows: Record<ItemRarity, string> = {
    common: 'shadow-[0_0_10px_rgba(139,115,85,0.3)]',
    uncommon: 'shadow-[0_0_12px_rgba(107,142,35,0.35)]',
    rare: 'shadow-[0_0_15px_rgba(70,130,180,0.4)]',
    epic: 'shadow-[0_0_20px_rgba(153,50,204,0.5)]',
    legendary: 'shadow-[0_0_30px_rgba(255,215,0,0.6)]',
  };
  return glows[rarity];
};

const getRarityBorder = (rarity: ItemRarity): string => {
  const borders: Record<ItemRarity, string> = {
    common: 'border-[#8B7355]',
    uncommon: 'border-[#6B8E23]',
    rare: 'border-[#4682B4]',
    epic: 'border-[#9932CC]',
    legendary: 'border-[#FFD700]',
  };
  return borders[rarity];
};

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  quantity = 1,
  equipped = false,
  onClick,
  onEquip,
  onUnequip,
  showActions = false,
  className = '',
}) => {
  const rarityColor = RARITY_COLORS[item.rarity];
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative rounded-xl p-4 cursor-pointer
        bg-gradient-to-br from-[#2D2418] to-[#1A1510]
        border-2 ${getRarityBorder(item.rarity)}
        ${getRarityGlow(item.rarity)}
        transition-all duration-300
        ${equipped ? 'ring-2 ring-[#FFD700] ring-offset-2 ring-offset-[#1A1510]' : ''}
        ${className}
      `}
    >
      {/* Equipped indicator */}
      {equipped && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FFD700] rounded-full flex items-center justify-center text-[#1A1510] text-xs font-bold z-10">
          ✓
        </div>
      )}
      
      {/* Quantity badge */}
      {quantity > 1 && (
        <div className="absolute -top-2 -left-2 min-w-6 h-6 bg-[#B87333] rounded-full flex items-center justify-center text-[#F5F0E8] text-xs font-bold px-2 z-10">
          {quantity}
        </div>
      )}
      
      {/* Item icon */}
      <div className="flex justify-center mb-3">
        <div 
          className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl"
          style={{ backgroundColor: `${rarityColor}20` }}
        >
          {item.icon}
        </div>
      </div>
      
      {/* Item name */}
      <h4 className="text-center font-bold text-[#F5F0E8] text-sm mb-1 line-clamp-2">
        {item.name}
      </h4>
      
      {/* Indigenous name */}
      {item.indigenousName && (
        <p className="text-center text-xs text-[#C9B896] italic mb-2">
          &quot;{item.indigenousName}&quot;
        </p>
      )}
      
      {/* Rarity badge */}
      <div className="flex justify-center mb-2">
        <span 
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ 
            backgroundColor: `${rarityColor}30`,
            color: rarityColor,
            border: `1px solid ${rarityColor}`,
          }}
        >
          {RARITY_NAMES[item.rarity]}
        </span>
      </div>
      
      {/* Stats preview */}
      {item.stats && (
        <div className="space-y-1 mt-2">
          {Object.entries(item.stats).map(([stat, value]) => (
            <div key={stat} className="flex justify-between text-xs">
              <span className="text-[#8B7355] capitalize">{stat}:</span>
              <span className="text-[#6B8E23] font-mono">+{value}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Level requirement */}
      {item.levelRequirement && (
        <div className="mt-2 text-center">
          <span className="text-xs text-[#8B7355]">
            Nv. {item.levelRequirement} necessário
          </span>
        </div>
      )}
      
      {/* Action buttons */}
      {showActions && (
        <div className="flex gap-2 mt-3">
          {equipped ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnequip?.();
              }}
              className="flex-1 btn-secondary text-xs py-2"
            >
              Desequipar
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEquip?.();
              }}
              className="flex-1 btn-primary text-xs py-2"
            >
              Equipar
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

interface ItemDetailModalProps {
  item: GameItem;
  quantity?: number;
  equipped?: boolean;
  onClose: () => void;
  onEquip?: () => void;
  onUnequip?: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  quantity = 1,
  equipped = false,
  onClose,
  onEquip,
  onUnequip,
}) => {
  const rarityColor = RARITY_COLORS[item.rarity];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="steampunk-card max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-20 h-20 rounded-xl flex items-center justify-center text-5xl"
            style={{ backgroundColor: `${rarityColor}30`, border: `2px solid ${rarityColor}` }}
          >
            {item.icon}
          </div>
          <button onClick={onClose} className="text-[#8B7355] hover:text-[#F5F0E8] text-2xl">
            ×
          </button>
        </div>
        
        {/* Content */}
        <h2 className="text-2xl font-bold text-[#F5F0E8] mb-1">{item.name}</h2>
        
        {item.indigenousName && (
          <p className="text-[#D4AF37] italic mb-2">
            {item.indigenousName}
            {item.indigenousMeaning && (
              <span className="text-[#8B7355] text-sm ml-2">({item.indigenousMeaning})</span>
            )}
          </p>
        )}
        
        <div className="flex items-center gap-2 mb-4">
          <span 
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: `${rarityColor}30`,
              color: rarityColor,
              border: `1px solid ${rarityColor}`,
            }}
          >
            {RARITY_NAMES[item.rarity]}
          </span>
          {quantity > 1 && (
            <span className="text-[#C9B896]">× {quantity}</span>
          )}
          {equipped && (
            <span className="badge-xp text-xs">Equipado</span>
          )}
        </div>
        
        <p className="text-[#C9B896] mb-6 leading-relaxed">{item.description}</p>
        
        {/* Stats */}
        {item.stats && (
          <div className="mb-6">
            <h3 className="text-[#D4AF37] font-bold mb-3 uppercase text-sm tracking-wider">Atributos</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(item.stats).map(([stat, value]) => (
                <div key={stat} className="flex items-center gap-2 bg-[#1A1510]/50 rounded-lg p-2">
                  <span className="text-[#8B7355] capitalize text-sm">{stat}:</span>
                  <span className="text-[#6B8E23] font-mono font-bold">+{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Effects */}
        {item.effects && item.effects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#D4AF37] font-bold mb-3 uppercase text-sm tracking-wider">Efeitos</h3>
            <div className="space-y-2">
              {item.effects.map((effect, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-[#C9B896]">
                    {effect.type === 'buff' && 'Buff'}
                    {effect.type === 'heal' && 'Cura'}
                    {effect.type === 'xp_boost' && 'Boost de XP'}
                    {effect.type === 'stat_boost' && 'Boost de Atributo'}
                    : +{effect.value}
                    {effect.duration && ` (${Math.floor(effect.duration / 60)}min)`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Requirements */}
        <div className="mb-6 text-sm">
          {item.levelRequirement && (
            <div className="flex items-center gap-2 text-[#8B7355]">
              <span>Nível necessário:</span>
              <span className="text-[#F5F0E8] font-mono">{item.levelRequirement}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-[#8B7355]">
            <span>Negociável:</span>
            <span className={item.tradable ? 'text-[#6B8E23]' : 'text-[#8B0000]'}>
              {item.tradable ? 'Sim' : 'Não'}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          {equipped ? (
            <button onClick={onUnequip} className="flex-1 btn-danger">
              Desequipar
            </button>
          ) : (
            <button onClick={onEquip} className="flex-1 btn-primary">
              Equipar
            </button>
          )}
          <button onClick={onClose} className="btn-secondary">
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
