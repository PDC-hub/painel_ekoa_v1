import React from 'react';
import { motion } from 'framer-motion';
import type { Mission } from '@/types';
import { 
  SUBJECT_NAMES, 
  DIFFICULTY_NAMES, 
  MISSION_TYPE_NAMES,
} from '@/types';
import { 
  Clock, 
  Target, 
  Zap, 
  CheckCircle2,
  BookOpen,
  FlaskConical,
  Atom,
  Mountain,
  Leaf,
  Star
} from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  completed?: boolean;
  onClick?: () => void;
  onComplete?: () => void;
  showActions?: boolean;
  className?: string;
}

const getSubjectIcon = (subject: Mission['subject']) => {
  switch (subject) {
    case 'biology': return BookOpen;
    case 'chemistry': return FlaskConical;
    case 'physics': return Atom;
    case 'geology': return Mountain;
    case 'ecology': return Leaf;
    default: return Star;
  }
};

const getDifficultyColor = (difficulty: Mission['difficulty']): string => {
  const colors: Record<Mission['difficulty'], string> = {
    easy: '#6B8E23',
    medium: '#DAA520',
    hard: '#CD853F',
    expert: '#8B0000',
  };
  return colors[difficulty];
};

const getTypeColor = (type: Mission['type']): string => {
  const colors: Record<Mission['type'], string> = {
    daily: '#4682B4',
    weekly: '#6B8E23',
    monthly: '#9932CC',
    special: '#FFD700',
  };
  return colors[type];
};

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  completed = false,
  onClick,
  onComplete,
  showActions = false,
  className = '',
}) => {
  const SubjectIcon = getSubjectIcon(mission.subject);
  const difficultyColor = getDifficultyColor(mission.difficulty);
  const typeColor = getTypeColor(mission.type);
  
  const isExpired = mission.deadline && new Date(mission.deadline) < new Date();
  
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        steampunk-card cursor-pointer
        ${completed ? 'opacity-75' : ''}
        ${isExpired ? 'opacity-50' : ''}
        ${className}
      `}
    >
      {/* Header with type and subject */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${typeColor}20`, border: `1px solid ${typeColor}` }}
          >
            <SubjectIcon className="w-5 h-5" style={{ color: typeColor }} />
          </div>
          <div>
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ 
                backgroundColor: `${typeColor}30`,
                color: typeColor,
              }}
            >
              {MISSION_TYPE_NAMES[mission.type]}
            </span>
          </div>
        </div>
        
        {completed && (
          <div className="flex items-center gap-1 text-[#6B8E23]">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Concluída</span>
          </div>
        )}
        
        {isExpired && !completed && (
          <span className="text-xs text-[#8B0000] bg-[#8B0000]/20 px-2 py-0.5 rounded-full">
            Expirada
          </span>
        )}
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-bold text-[#F5F0E8] mb-2 line-clamp-2">
        {mission.title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-[#C9B896] mb-4 line-clamp-2">
        {mission.description}
      </p>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span 
          className="text-xs px-2 py-1 rounded flex items-center gap-1"
          style={{ 
            backgroundColor: `${difficultyColor}20`,
            color: difficultyColor,
          }}
        >
          <Target className="w-3 h-3" />
          {DIFFICULTY_NAMES[mission.difficulty]}
        </span>
        
        <span className="text-xs px-2 py-1 rounded bg-[#B87333]/20 text-[#B87333] flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {SUBJECT_NAMES[mission.subject]}
        </span>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* XP Reward */}
        <div className="flex items-center gap-2">
          <div className="badge-xp flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {mission.xpReward} XP
          </div>
        </div>
        
        {/* Deadline */}
        {mission.deadline && (
          <div className={`flex items-center gap-1 text-xs ${isExpired ? 'text-[#8B0000]' : 'text-[#8B7355]'}`}>
            <Clock className="w-3 h-3" />
            {new Date(mission.deadline).toLocaleDateString('pt-BR')}
          </div>
        )}
      </div>
      
      {/* Action button */}
      {showActions && !completed && !isExpired && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            onComplete?.();
          }}
          className="w-full mt-4 btn-primary text-sm py-2"
        >
          Completar Missão
        </motion.button>
      )}
    </motion.div>
  );
};

interface MissionDetailModalProps {
  mission: Mission;
  completed?: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const MissionDetailModal: React.FC<MissionDetailModalProps> = ({
  mission,
  completed = false,
  onClose,
  onComplete,
}) => {
  const SubjectIcon = getSubjectIcon(mission.subject);
  const difficultyColor = getDifficultyColor(mission.difficulty);
  const typeColor = getTypeColor(mission.type);
  
  const isExpired = mission.deadline && new Date(mission.deadline) < new Date();
  
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
        className="steampunk-card max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${typeColor}20`, border: `2px solid ${typeColor}` }}
            >
              <SubjectIcon className="w-7 h-7" style={{ color: typeColor }} />
            </div>
            <div>
              <span 
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ 
                  backgroundColor: `${typeColor}30`,
                  color: typeColor,
                }}
              >
                {MISSION_TYPE_NAMES[mission.type]}
              </span>
              <p className="text-xs text-[#8B7355] mt-1">
                Criada em {new Date(mission.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8B7355] hover:text-[#F5F0E8] text-2xl">
            ×
          </button>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-[#F5F0E8] mb-3">{mission.title}</h2>
        
        {/* Description */}
        <p className="text-[#C9B896] mb-6 leading-relaxed">{mission.description}</p>
        
        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1A1510]/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-[#8B7355] text-sm mb-1">
              <Target className="w-4 h-4" />
              Dificuldade
            </div>
            <span 
              className="font-medium"
              style={{ color: difficultyColor }}
            >
              {DIFFICULTY_NAMES[mission.difficulty]}
            </span>
          </div>
          
          <div className="bg-[#1A1510]/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-[#8B7355] text-sm mb-1">
              <BookOpen className="w-4 h-4" />
              Disciplina
            </div>
            <span className="font-medium text-[#B87333]">
              {SUBJECT_NAMES[mission.subject]}
            </span>
          </div>
          
          <div className="bg-[#1A1510]/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-[#8B7355] text-sm mb-1">
              <Zap className="w-4 h-4" />
              Recompensa XP
            </div>
            <span className="font-mono font-bold text-[#FFD700]">
              {mission.xpReward} XP
            </span>
          </div>
          
          {mission.deadline && (
            <div className="bg-[#1A1510]/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#8B7355] text-sm mb-1">
                <Clock className="w-4 h-4" />
                Prazo
              </div>
              <span className={`font-medium ${isExpired ? 'text-[#8B0000]' : 'text-[#F5F0E8]'}`}>
                {new Date(mission.deadline).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>
        
        {/* Requirements */}
        {mission.requirements && mission.requirements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#D4AF37] font-bold mb-3 uppercase text-sm tracking-wider">
              Requisitos
            </h3>
            <div className="space-y-2">
              {mission.requirements.map((req, index) => (
                <div key={index} className="flex items-start gap-2 bg-[#1A1510]/50 rounded-lg p-3">
                  <div className="w-6 h-6 rounded-full bg-[#B87333]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-[#B87333] font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F5F0E8] capitalize">
                      {req.type === 'quiz' && 'Quiz'}
                      {req.type === 'assignment' && 'Tarefa'}
                      {req.type === 'practical' && 'Atividade Prática'}
                      {req.type === 'research' && 'Pesquisa'}
                    </p>
                    <p className="text-sm text-[#C9B896]">{req.description}</p>
                    {req.minScore && (
                      <p className="text-xs text-[#8B7355] mt-1">
                        Pontuação mínima: {req.minScore}%
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Status */}
        {completed && (
          <div className="flex items-center gap-2 bg-[#6B8E23]/20 rounded-lg p-4 mb-6">
            <CheckCircle2 className="w-6 h-6 text-[#6B8E23]" />
            <div>
              <p className="text-[#6B8E23] font-medium">Missão Concluída!</p>
              <p className="text-sm text-[#8B7355]">Você já recebeu sua recompensa</p>
            </div>
          </div>
        )}
        
        {isExpired && !completed && (
          <div className="flex items-center gap-2 bg-[#8B0000]/20 rounded-lg p-4 mb-6">
            <Clock className="w-6 h-6 text-[#8B0000]" />
            <div>
              <p className="text-[#8B0000] font-medium">Prazo Expirado</p>
              <p className="text-sm text-[#8B7355]">Esta missão não está mais disponível</p>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3">
          {!completed && !isExpired && (
            <button onClick={onComplete} className="flex-1 btn-primary">
              Completar Missão
            </button>
          )}
          <button onClick={onClose} className={completed || isExpired ? 'flex-1 btn-secondary' : 'btn-secondary'}>
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
