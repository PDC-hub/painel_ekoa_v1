import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SteamPunkDivider } from './SteamPunkGear';
import { XPBar, XPGainAnimation, LevelUpAnimation } from './XPBar';
import { ItemCard, ItemDetailModal } from './ItemCard';
import { MissionCard, MissionDetailModal } from './MissionCard';
import type { Student, Mission, GameItem, Guild, Class } from '@/types';
import { 
  Sword, 
  Brain, 
  Heart, 
  Zap, 
  Star, 
  Users, 
  Trophy,
  Calendar,
  Package,
  Target,
  LogOut
} from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  classInfo: Class;
  guildInfo?: Guild;
  activeMissions: Mission[];
  availableMissions: Mission[];
  leaderboard: { rank: number; studentName: string; avatar?: string; level: number; xp: number; guildName?: string }[];
  inventory: { itemId: string; quantity: number; acquiredAt: Date; equipped: boolean; item: GameItem }[];
  onCompleteMission: (missionId: string) => void;
  onEquipItem: (itemId: string) => void;
  onUnequipItem: (itemId: string) => void;
  onLogout: () => void;
}

const StatIcon = ({ stat }: { stat: string }) => {
  switch (stat) {
    case 'strength': return <Sword className="w-4 h-4" />;
    case 'intelligence': return <Brain className="w-4 h-4" />;
    case 'wisdom': return <Star className="w-4 h-4" />;
    case 'dexterity': return <Zap className="w-4 h-4" />;
    case 'constitution': return <Heart className="w-4 h-4" />;
    case 'charisma': return <Users className="w-4 h-4" />;
    default: return <Target className="w-4 h-4" />;
  }
};

const StatName: Record<string, string> = {
  strength: 'Força',
  intelligence: 'Inteligência',
  wisdom: 'Sabedoria',
  dexterity: 'Destreza',
  constitution: 'Constituição',
  charisma: 'Carisma',
};

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  classInfo,
  guildInfo,
  activeMissions,
  availableMissions,
  leaderboard,
  inventory,
  onCompleteMission,
  onEquipItem,
  onUnequipItem,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'missions' | 'inventory' | 'guild'>('overview');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [showXPGain, setShowXPGain] = useState<number | null>(null);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);

  const handleCompleteMission = (missionId: string) => {
    const mission = activeMissions.find(m => m.id === missionId);
    if (mission) {
      onCompleteMission(missionId);
      setShowXPGain(mission.xpReward);
      setSelectedMission(null);
      
      // Check for level up
      const newXp = student.xp + mission.xpReward;
      if (newXp >= student.xpToNextLevel) {
        setTimeout(() => {
          setShowLevelUp(student.level + 1);
        }, 1500);
      }
      
      setTimeout(() => setShowXPGain(null), 2000);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Target },
    { id: 'missions', label: 'Missões', icon: Calendar },
    { id: 'inventory', label: 'Inventário', icon: Package },
    { id: 'guild', label: 'Guilda', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#1A1510]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#1A1510]/95 backdrop-blur-sm border-b border-[#B87333]/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B87333] to-[#8B4513] flex items-center justify-center text-3xl border-2 border-[#D4AF37]">
                {student.avatar}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#F5F0E8]">{student.name}</h1>
                <p className="text-sm text-[#8B7355]">{classInfo.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <XPBar 
                current={student.xp} 
                max={student.xpToNextLevel} 
                level={student.level}
                size="sm"
              />
              <button 
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-[#8B0000]/20 text-[#8B7355] hover:text-[#8B0000] transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#2D2418] border-b border-[#B87333]/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                    activeTab === tab.id
                      ? 'text-[#D4AF37]'
                      : 'text-[#8B7355] hover:text-[#C9B896]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(student.stats).map(([stat, value]) => (
                  <div key={stat} className="steampunk-card text-center">
                    <div className="flex justify-center mb-2 text-[#B87333]">
                      <StatIcon stat={stat} />
                    </div>
                    <div className="text-2xl font-bold text-[#F5F0E8] font-mono">{value}</div>
                    <div className="text-xs text-[#8B7355]">{StatName[stat]}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Active Missions */}
                <div className="lg:col-span-2">
                  <div className="steampunk-card">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-[#F5F0E8] flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#B87333]" />
                        Missões Ativas
                      </h2>
                      <button 
                        onClick={() => setActiveTab('missions')}
                        className="text-sm text-[#B87333] hover:text-[#D4AF37]"
                      >
                        Ver todas
                      </button>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {activeMissions.slice(0, 4).map((mission) => (
                        <MissionCard
                          key={mission.id}
                          mission={mission}
                          onClick={() => setSelectedMission(mission)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Guild Info */}
                  {guildInfo && (
                    <div className="steampunk-card">
                      <h2 className="text-lg font-bold text-[#F5F0E8] flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-[#B87333]" />
                        Sua Guilda
                      </h2>
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: guildInfo.color }}
                        >
                          {guildInfo.emblem === 'gear' && '⚙️'}
                          {guildInfo.emblem === 'feather' && '🪶'}
                          {guildInfo.emblem === 'mask' && '🎭'}
                          {guildInfo.emblem === 'totem' && '🗿'}
                          {guildInfo.emblem === 'compass' && '🧭'}
                          {guildInfo.emblem === 'flame' && '🔥'}
                          {guildInfo.emblem === 'tree' && '🌳'}
                          {guildInfo.emblem === 'mountain' && '⛰️'}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#F5F0E8]">{guildInfo.name}</h3>
                          <p className="text-xs text-[#8B7355]">Nv. {guildInfo.level}</p>
                        </div>
                      </div>
                      <p className="text-sm text-[#C9B896] mb-3">{guildInfo.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#8B7355]">Membros:</span>
                        <span className="text-[#F5F0E8] font-mono">{guildInfo.members.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#8B7355]">XP Total:</span>
                        <span className="text-[#FFD700] font-mono">{guildInfo.totalXp.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Leaderboard */}
                  <div className="steampunk-card">
                    <h2 className="text-lg font-bold text-[#F5F0E8] flex items-center gap-2 mb-4">
                      <Trophy className="w-5 h-5 text-[#FFD700]" />
                      Ranking
                    </h2>
                    <div className="space-y-2">
                      {leaderboard.slice(0, 5).map((entry, index) => (
                        <div 
                          key={index}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            entry.studentName === student.name ? 'bg-[#B87333]/20' : 'bg-[#1A1510]/50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            entry.rank === 1 ? 'bg-[#FFD700] text-[#1A1510]' :
                            entry.rank === 2 ? 'bg-[#C0C0C0] text-[#1A1510]' :
                            entry.rank === 3 ? 'bg-[#CD7F32] text-[#1A1510]' :
                            'bg-[#3D3020] text-[#8B7355]'
                          }`}>
                            {entry.rank}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#F5F0E8]">{entry.studentName}</p>
                            <p className="text-xs text-[#8B7355]">Nv. {entry.level}</p>
                          </div>
                          <span className="text-xs font-mono text-[#FFD700]">{entry.xp.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Missions Tab */}
          {activeTab === 'missions' && (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="steampunk-card">
                    <h2 className="text-xl font-bold text-[#F5F0E8] mb-6">Missões Disponíveis</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {availableMissions.map((mission) => (
                        <MissionCard
                          key={mission.id}
                          mission={mission}
                          completed={student.completedMissions.includes(mission.id)}
                          onClick={() => setSelectedMission(mission)}
                          showActions
                          onComplete={() => handleCompleteMission(mission.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="steampunk-card">
                    <h2 className="text-lg font-bold text-[#F5F0E8] mb-4">Progresso</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#8B7355]">Missões Completadas</span>
                          <span className="text-[#F5F0E8] font-mono">
                            {student.completedMissions.length} / {availableMissions.length}
                          </span>
                        </div>
                        <div className="h-2 bg-[#1A1510] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#B87333] to-[#FFD700]"
                            style={{ 
                              width: `${(student.completedMissions.length / availableMissions.length) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-[#B87333]/30">
                        <div className="flex items-center justify-between">
                          <span className="text-[#8B7355]">Total de XP</span>
                          <span className="text-[#FFD700] font-mono font-bold">
                            {student.totalXp.toLocaleString()} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="steampunk-card">
                <h2 className="text-xl font-bold text-[#F5F0E8] mb-6">Seu Inventário</h2>
                
                {inventory.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-[#8B7355] mx-auto mb-4" />
                    <p className="text-[#8B7355]">Seu inventário está vazio</p>
                    <p className="text-sm text-[#8B7355]/70 mt-2">
                      Complete missões para ganhar itens!
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {inventory.map(({ item, quantity, equipped }) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        quantity={quantity}
                        equipped={equipped}
                        onClick={() => setSelectedItem(item)}
                        showActions
                        onEquip={() => onEquipItem(item.id)}
                        onUnequip={() => onUnequipItem(item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Guild Tab */}
          {activeTab === 'guild' && (
            <motion.div
              key="guild"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {guildInfo ? (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="steampunk-card">
                      <div className="flex items-center gap-4 mb-6">
                        <div 
                          className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
                          style={{ backgroundColor: guildInfo.color }}
                        >
                          {guildInfo.emblem === 'gear' && '⚙️'}
                          {guildInfo.emblem === 'feather' && '🪶'}
                          {guildInfo.emblem === 'mask' && '🎭'}
                          {guildInfo.emblem === 'totem' && '🗿'}
                          {guildInfo.emblem === 'compass' && '🧭'}
                          {guildInfo.emblem === 'flame' && '🔥'}
                          {guildInfo.emblem === 'tree' && '🌳'}
                          {guildInfo.emblem === 'mountain' && '⛰️'}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-[#F5F0E8]">{guildInfo.name}</h2>
                          <p className="text-[#8B7355]">Nv. {guildInfo.level} • {guildInfo.members.length} membros</p>
                        </div>
                      </div>
                      
                      <p className="text-[#C9B896] mb-6">{guildInfo.description}</p>
                      
                      <SteamPunkDivider />
                      
                      <h3 className="text-lg font-bold text-[#F5F0E8] mb-4">Membros</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {guildInfo.members.map((memberId) => {
                          // This would be fetched from actual data
                          const memberName = memberId === student.id ? student.name : `Membro ${memberId}`;
                          return (
                            <div key={memberId} className="flex items-center gap-3 bg-[#1A1510]/50 rounded-lg p-3">
                              <div className="w-10 h-10 rounded-full bg-[#B87333]/30 flex items-center justify-center">
                                {memberId === student.id ? student.avatar : '👤'}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#F5F0E8]">{memberName}</p>
                                {memberId === guildInfo.leaderId && (
                                  <span className="text-xs text-[#FFD700]">Líder</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="steampunk-card">
                      <h3 className="text-lg font-bold text-[#F5F0E8] mb-4">Estatísticas</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[#8B7355]">XP Total</span>
                          <span className="text-[#FFD700] font-mono font-bold">
                            {guildInfo.totalXp.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#8B7355]">Nível</span>
                          <span className="text-[#F5F0E8] font-mono">{guildInfo.level}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#8B7355]">Membros</span>
                          <span className="text-[#F5F0E8] font-mono">{guildInfo.members.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="steampunk-card text-center py-16">
                  <Users className="w-20 h-20 text-[#8B7355] mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-[#F5F0E8] mb-2">Sem Guilda</h2>
                  <p className="text-[#8B7355] max-w-md mx-auto">
                    Você ainda não faz parte de uma guilda. Peça ao seu professor para adicioná-lo a uma!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {selectedMission && (
          <MissionDetailModal
            mission={selectedMission}
            completed={student.completedMissions.includes(selectedMission.id)}
            onClose={() => setSelectedMission(null)}
            onComplete={() => handleCompleteMission(selectedMission.id)}
          />
        )}
        
        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            equipped={Object.values(student.equippedItems).includes(selectedItem.id)}
            onClose={() => setSelectedItem(null)}
            onEquip={() => {
              onEquipItem(selectedItem.id);
              setSelectedItem(null);
            }}
            onUnequip={() => {
              onUnequipItem(selectedItem.id);
              setSelectedItem(null);
            }}
          />
        )}
        
        {showXPGain && (
          <XPGainAnimation 
            amount={showXPGain} 
            onComplete={() => setShowXPGain(null)}
          />
        )}
        
        {showLevelUp && (
          <LevelUpAnimation 
            level={showLevelUp}
            onComplete={() => setShowLevelUp(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
