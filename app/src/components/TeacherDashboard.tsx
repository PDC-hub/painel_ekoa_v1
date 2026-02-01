import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { 
  Class, 
  Guild, 
  Mission, 
  Student,
  CreateClassForm,
  CreateMissionForm,
  CreateGuildForm,
  AddStudentForm,
  CloudProvider,
  PunishmentType
} from '@/types';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Settings,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Cloud,
  LogOut,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Crown,
  Eye,
  TrendingUp,
  Target
} from 'lucide-react';

interface TeacherDashboardProps {
  teacher: { 
    id: string; 
    name: string; 
    email: string; 
    role: 'teacher'; 
    avatar?: string; 
    createdAt: Date; 
    lastLogin: Date; 
    classes: string[]; 
    cloudProvider?: CloudProvider; 
    cloudConfig?: { 
      provider: CloudProvider; 
      folderId?: string; 
      accessToken?: string; 
      refreshToken?: string; 
      expiresAt?: Date; 
    } 
  };
  classes: Class[];
  guilds: Guild[];
  missions: Mission[];
  students: Student[];
  activityLogs: { id: string; type: string; description: string; userName: string; timestamp: Date }[];
  leaderboard: { rank: number; studentName: string; level: number; xp: number; guildName?: string }[];
  onCreateClass: (data: CreateClassForm) => void;
  onDeleteClass: (classId: string) => void;
  onCreateGuild: (data: CreateGuildForm) => void;
  onAddStudent: (data: AddStudentForm) => void;
  onRemoveStudent: (studentId: string) => void;
  onResetPassword: (studentId: string) => string;
  onCreateMission: (data: CreateMissionForm) => void;
  onDeleteMission: (missionId: string) => void;
  onGivePunishment: (studentId: string, punishment: { type: PunishmentType; reason: string; xpLoss?: number }) => void;
  onGiveItem: (studentId: string, itemId: string) => void;
  onCloudConnect: (provider: CloudProvider) => Promise<boolean>;
  onCloudDisconnect: () => void;
  onCreateBackup: () => Promise<boolean>;
  onExportData: () => void;
  onImportData: (file: File) => Promise<boolean>;
  isCloudConnected: boolean;
  cloudProvider: CloudProvider | null;
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  classes,
  guilds,
  missions,
  students,
  activityLogs,
  leaderboard,
  onCreateClass,
  onDeleteClass,
  onCreateGuild,
  onAddStudent,
  onRemoveStudent,
  onResetPassword,
  onCreateMission,
  onDeleteMission,
  onGivePunishment,
  onCloudConnect,
  onCloudDisconnect,
  onCreateBackup,
  onExportData,
  onImportData,
  isCloudConnected,
  cloudProvider,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'missions' | 'students' | 'settings'>('overview');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showCreateMissionModal, setShowCreateMissionModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showCreateGuildModal, setShowCreateGuildModal] = useState(false);
  const [showPunishmentModal, setShowPunishmentModal] = useState<string | null>(null);
  const [resetPasswordResult, setResetPasswordResult] = useState<string | null>(null);
  const [newClassName, setNewClassName] = useState('');
  const [newMission, setNewMission] = useState<Partial<CreateMissionForm>>({
    title: '',
    description: '',
    type: 'weekly',
    subject: 'biology',
    difficulty: 'medium',
    xpReward: 100,
    classId: '',
  });
  const [newStudent, setNewStudent] = useState<Partial<AddStudentForm>>({
    name: '',
    email: '',
    classId: '',
  });
  const [newGuild, setNewGuild] = useState<Partial<CreateGuildForm>>({
    name: '',
    classId: '',
    description: '',
    emblem: 'gear',
    color: '#B87333',
  });
  const [punishment, setPunishment] = useState<{
    type: PunishmentType;
    reason: string;
    xpLoss?: number;
  }>({
    type: 'warning',
    reason: '',
    xpLoss: 0,
  });



  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'classes', label: 'Turmas', icon: Users },
    { id: 'missions', label: 'Missões', icon: Target },
    { id: 'students', label: 'Alunos', icon: BookOpen },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleCreateClassSubmit = () => {
    if (newClassName.trim()) {
      onCreateClass({ name: newClassName.trim() });
      setNewClassName('');
      setShowCreateClassModal(false);
    }
  };

  const handleCreateMissionSubmit = () => {
    if (newMission.title && newMission.description && newMission.classId) {
      onCreateMission(newMission as CreateMissionForm);
      setNewMission({
        title: '',
        description: '',
        type: 'weekly',
        subject: 'biology',
        difficulty: 'medium',
        xpReward: 100,
        classId: '',
      });
      setShowCreateMissionModal(false);
    }
  };

  const handleAddStudentSubmit = () => {
    if (newStudent.name && newStudent.email && newStudent.classId) {
      onAddStudent(newStudent as AddStudentForm);
      setNewStudent({
        name: '',
        email: '',
        classId: '',
      });
      setShowAddStudentModal(false);
    }
  };

  const handleCreateGuildSubmit = () => {
    if (newGuild.name && newGuild.classId) {
      onCreateGuild(newGuild as CreateGuildForm);
      setNewGuild({
        name: '',
        classId: '',
        description: '',
        emblem: 'gear',
        color: '#B87333',
      });
      setShowCreateGuildModal(false);
    }
  };

  const handlePunishmentSubmit = () => {
    if (showPunishmentModal && punishment.reason) {
      onGivePunishment(showPunishmentModal, punishment);
      setPunishment({
        type: 'warning',
        reason: '',
        xpLoss: 0,
      });
      setShowPunishmentModal(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1510]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#1A1510]/95 backdrop-blur-sm border-b border-[#B87333]/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B87333] to-[#8B4513] flex items-center justify-center text-3xl border-2 border-[#D4AF37]">
                {teacher.avatar}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#F5F0E8]">{teacher.name}</h1>
                <p className="text-sm text-[#8B7355]">Professor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isCloudConnected && (
                <div className="flex items-center gap-2 text-sm text-[#6B8E23]">
                  <Cloud className="w-4 h-4" />
                  <span>Conectado</span>
                </div>
              )}
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
                      layoutId="teacherActiveTab"
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
              {/* Stats Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="steampunk-card">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#B87333]/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#B87333]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#F5F0E8]">{classes.length}</p>
                      <p className="text-sm text-[#8B7355]">Turmas</p>
                    </div>
                  </div>
                </div>
                
                <div className="steampunk-card">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#6B8E23]/20 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-[#6B8E23]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#F5F0E8]">{students.length}</p>
                      <p className="text-sm text-[#8B7355]">Alunos</p>
                    </div>
                  </div>
                </div>
                
                <div className="steampunk-card">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#F5F0E8]">{missions.length}</p>
                      <p className="text-sm text-[#8B7355]">Missões Ativas</p>
                    </div>
                  </div>
                </div>
                
                <div className="steampunk-card">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#9932CC]/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#9932CC]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#F5F0E8]">{guilds.length}</p>
                      <p className="text-sm text-[#8B7355]">Guildas</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <div className="steampunk-card">
                    <h2 className="text-lg font-bold text-[#F5F0E8] mb-4">Atividade Recente</h2>
                    <div className="space-y-3">
                      {activityLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 bg-[#1A1510]/50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            log.type === 'mission_completed' ? 'bg-[#6B8E23]/20' :
                            log.type === 'mission_created' ? 'bg-[#4682B4]/20' :
                            log.type === 'student_joined' ? 'bg-[#FFD700]/20' :
                            'bg-[#B87333]/20'
                          }`}>
                            {log.type === 'mission_completed' && <CheckCircle2 className="w-4 h-4 text-[#6B8E23]" />}
                            {log.type === 'mission_created' && <Target className="w-4 h-4 text-[#4682B4]" />}
                            {log.type === 'student_joined' && <Users className="w-4 h-4 text-[#FFD700]" />}
                            {log.type === 'guild_created' && <Crown className="w-4 h-4 text-[#B87333]" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-[#F5F0E8]">{log.description}</p>
                            <p className="text-xs text-[#8B7355]">
                              {new Date(log.timestamp).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Leaderboard */}
                <div>
                  <div className="steampunk-card">
                    <h2 className="text-lg font-bold text-[#F5F0E8] mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[#FFD700]" />
                      Top Alunos
                    </h2>
                    <div className="space-y-2">
                      {leaderboard.slice(0, 5).map((entry) => (
                        <div 
                          key={entry.rank}
                          className="flex items-center gap-3 p-2 bg-[#1A1510]/50 rounded-lg"
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

          {/* Classes Tab */}
          {activeTab === 'classes' && (
            <motion.div
              key="classes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#F5F0E8]">Gerenciar Turmas</h2>
                <button 
                  onClick={() => setShowCreateClassModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nova Turma
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="steampunk-card">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#F5F0E8]">{cls.name}</h3>
                        <p className="text-sm text-[#8B7355]">Código: {cls.inviteCode}</p>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setSelectedClass(cls.id)}
                          className="p-2 rounded-lg hover:bg-[#B87333]/20 text-[#8B7355] hover:text-[#B87333]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteClass(cls.id)}
                          className="p-2 rounded-lg hover:bg-[#8B0000]/20 text-[#8B7355] hover:text-[#8B0000]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-[#1A1510]/50 rounded-lg">
                        <p className="text-lg font-bold text-[#F5F0E8]">{cls.students.length}</p>
                        <p className="text-xs text-[#8B7355]">Alunos</p>
                      </div>
                      <div className="text-center p-2 bg-[#1A1510]/50 rounded-lg">
                        <p className="text-lg font-bold text-[#F5F0E8]">
                          {missions.filter(m => m.classId === cls.id).length}
                        </p>
                        <p className="text-xs text-[#8B7355]">Missões</p>
                      </div>
                      <div className="text-center p-2 bg-[#1A1510]/50 rounded-lg">
                        <p className="text-lg font-bold text-[#F5F0E8]">
                          {guilds.filter(g => g.classId === cls.id).length}
                        </p>
                        <p className="text-xs text-[#8B7355]">Guildas</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedClass(cls.id)}
                      className="w-full btn-secondary text-sm py-2"
                    >
                      Gerenciar Turma
                    </button>
                  </div>
                ))}
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#F5F0E8]">Gerenciar Missões</h2>
                <button 
                  onClick={() => setShowCreateMissionModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nova Missão
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {missions.map((mission) => (
                  <div key={mission.id} className="steampunk-card">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        mission.type === 'daily' ? 'bg-[#4682B4]/20 text-[#4682B4]' :
                        mission.type === 'weekly' ? 'bg-[#6B8E23]/20 text-[#6B8E23]' :
                        mission.type === 'monthly' ? 'bg-[#9932CC]/20 text-[#9932CC]' :
                        'bg-[#FFD700]/20 text-[#FFD700]'
                      }`}>
                        {mission.type}
                      </span>
                      <button 
                        onClick={() => onDeleteMission(mission.id)}
                        className="p-1 rounded hover:bg-[#8B0000]/20 text-[#8B7355] hover:text-[#8B0000]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-[#F5F0E8] mb-2">{mission.title}</h3>
                    <p className="text-sm text-[#C9B896] mb-3 line-clamp-2">{mission.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge-xp text-xs">{mission.xpReward} XP</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        mission.difficulty === 'easy' ? 'bg-[#6B8E23]/20 text-[#6B8E23]' :
                        mission.difficulty === 'medium' ? 'bg-[#DAA520]/20 text-[#DAA520]' :
                        mission.difficulty === 'hard' ? 'bg-[#CD853F]/20 text-[#CD853F]' :
                        'bg-[#8B0000]/20 text-[#8B0000]'
                      }`}>
                        {mission.difficulty}
                      </span>
                    </div>
                    
                    {mission.deadline && (
                      <p className="text-xs text-[#8B7355]">
                        Prazo: {new Date(mission.deadline).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#F5F0E8]">Gerenciar Alunos</h2>
                <button 
                  onClick={() => setShowAddStudentModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Aluno
                </button>
              </div>

              <div className="steampunk-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#B87333]/30">
                        <th className="text-left p-4 text-[#C9B896] font-medium">Aluno</th>
                        <th className="text-left p-4 text-[#C9B896] font-medium">Turma</th>
                        <th className="text-left p-4 text-[#C9B896] font-medium">Nível</th>
                        <th className="text-left p-4 text-[#C9B896] font-medium">XP Total</th>
                        <th className="text-left p-4 text-[#C9B896] font-medium">Guilda</th>
                        <th className="text-left p-4 text-[#C9B896] font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => {
                        const studentClass = classes.find(c => c.id === student.classId);
                        const studentGuild = guilds.find(g => g.id === student.guildId);
                        return (
                          <tr key={student.id} className="border-b border-[#B87333]/10 hover:bg-[#B87333]/5">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#B87333]/30 flex items-center justify-center">
                                  {student.avatar}
                                </div>
                                <div>
                                  <p className="font-medium text-[#F5F0E8]">{student.name}</p>
                                  <p className="text-sm text-[#8B7355]">{student.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-[#C9B896]">{studentClass?.name || '-'}</td>
                            <td className="p-4">
                              <span className="badge-level text-sm py-1">Nv. {student.level}</span>
                            </td>
                            <td className="p-4 text-[#FFD700] font-mono">{student.totalXp.toLocaleString()}</td>
                            <td className="p-4 text-[#C9B896]">{studentGuild?.name || '-'}</td>
                            <td className="p-4">
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => {
                                    const newPassword = onResetPassword(student.id);
                                    setResetPasswordResult(newPassword);
                                  }}
                                  className="p-2 rounded-lg hover:bg-[#B87333]/20 text-[#8B7355] hover:text-[#B87333]"
                                  title="Resetar senha"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setShowPunishmentModal(student.id)}
                                  className="p-2 rounded-lg hover:bg-[#8B0000]/20 text-[#8B7355] hover:text-[#8B0000]"
                                  title="Aplicar punição"
                                >
                                  <AlertTriangle className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => onRemoveStudent(student.id)}
                                  className="p-2 rounded-lg hover:bg-[#8B0000]/20 text-[#8B7355] hover:text-[#8B0000]"
                                  title="Remover aluno"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Cloud Storage */}
              <div className="steampunk-card">
                <h2 className="text-lg font-bold text-[#F5F0E8] mb-4 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-[#B87333]" />
                  Armazenamento em Nuvem
                </h2>
                
                {isCloudConnected ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-[#6B8E23]/10 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-[#6B8E23]" />
                      <div>
                        <p className="text-[#F5F0E8]">Conectado ao {cloudProvider}</p>
                        <p className="text-sm text-[#8B7355]">Seus dados estão sincronizados</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button onClick={onCreateBackup} className="btn-primary flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Criar Backup
                      </button>
                      <button onClick={onCloudDisconnect} className="btn-secondary flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Desconectar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[#C9B896]">Conecte-se a um serviço de nuvem para fazer backup dos seus dados.</p>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => onCloudConnect('google_drive')}
                        className="btn-secondary flex items-center gap-2"
                      >
                        📁 Google Drive
                      </button>
                      <button 
                        onClick={() => onCloudConnect('dropbox')}
                        className="btn-secondary flex items-center gap-2"
                      >
                        📦 Dropbox
                      </button>
                      <button 
                        onClick={() => onCloudConnect('onedrive')}
                        className="btn-secondary flex items-center gap-2"
                      >
                        ☁️ OneDrive
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Data Export/Import */}
              <div className="steampunk-card">
                <h2 className="text-lg font-bold text-[#F5F0E8] mb-4">Exportar/Importar Dados</h2>
                <div className="flex gap-3">
                  <button onClick={onExportData} className="btn-secondary flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar para Arquivo
                  </button>
                  <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Importar de Arquivo
                    <input 
                      type="file" 
                      accept=".json" 
                      className="hidden" 
                      onChange={(e) => e.target.files?.[0] && onImportData(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showCreateClassModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateClassModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="steampunk-card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#F5F0E8] mb-4">Criar Nova Turma</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#C9B896] mb-2">Nome da Turma</label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Ex: 7º Ano A"
                    className="steampunk-input"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCreateClassSubmit} className="flex-1 btn-primary">
                    Criar
                  </button>
                  <button onClick={() => setShowCreateClassModal(false)} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Mission Modal */}
      <AnimatePresence>
        {showCreateMissionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateMissionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="steampunk-card max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#F5F0E8] mb-4">Criar Nova Missão</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#C9B896] mb-2">Título</label>
                  <input
                    type="text"
                    value={newMission.title}
                    onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                    placeholder="Nome da missão"
                    className="steampunk-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#C9B896] mb-2">Descrição</label>
                  <textarea
                    value={newMission.description}
                    onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                    placeholder="Descrição da missão"
                    className="steampunk-input min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#C9B896] mb-2">Tipo</label>
                    <select
                      value={newMission.type}
                      onChange={(e) => setNewMission({ ...newMission, type: e.target.value as Mission['type'] })}
                      className="steampunk-input"
                    >
                      <option value="daily">Diária</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                      <option value="special">Especial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#C9B896] mb-2">Disciplina</label>
                    <select
                      value={newMission.subject}
                      onChange={(e) => setNewMission({ ...newMission, subject: e.target.value as Mission['subject'] })}
                      className="steampunk-input"
                    >
                      <option value="biology">Biologia</option>
                      <option value="chemistry">Química</option>
                      <option value="physics">Física</option>
                      <option value="geology">Geologia</option>
                      <option value="ecology">Ecologia</option>
                      <option value="general">Geral</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#C9B896] mb-2">Dificuldade</label>
                    <select
                      value={newMission.difficulty}
                      onChange={(e) => setNewMission({ ...newMission, difficulty: e.target.value as Mission['difficulty'] })}
                      className="steampunk-input"
                    >
                      <option value="easy">Fácil</option>
                      <option value="medium">Médio</option>
                      <option value="hard">Difícil</option>
                      <option value="expert">Especialista</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#C9B896] mb-2">XP</label>
                    <input
                      type="number"
                      value={newMission.xpReward}
                      onChange={(e) => setNewMission({ ...newMission, xpReward: parseInt(e.target.value) })}
                      className="steampunk-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#C9B896] mb-2">Turma</label>
                  <select
                    value={newMission.classId}
                    onChange={(e) => setNewMission({ ...newMission, classId: e.target.value })}
                    className="steampunk-input"
                  >
                    <option value="">Selecione uma turma</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCreateMissionSubmit} className="flex-1 btn-primary">
                    Criar
                  </button>
                  <button onClick={() => setShowCreateMissionModal(false)} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddStudentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddStudentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="steampunk-card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#F5F0E8] mb-4">Adicionar Aluno</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#C9B896] mb-2">Nome</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="Nome do aluno"
                    className="steampunk-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#C9B896] mb-2">Email</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    placeholder="email@escola.edu.br"
                    className="steampunk-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#C9B896] mb-2">Turma</label>
                  <select
                    value={newStudent.classId}
                    onChange={(e) => setNewStudent({ ...newStudent, classId: e.target.value })}
                    className="steampunk-input"
                  >
                    <option value="">Selecione uma turma</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddStudentSubmit} className="flex-1 btn-primary">
                    Adicionar
                  </button>
                  <button onClick={() => setShowAddStudentModal(false)} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Guild Modal */}
      <AnimatePresence>
        {showCreateGuildModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateGuildModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="steampunk-card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#F5F0E8] mb-4">Criar Nova Guilda</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#C9B896] mb-2">Nome</label>
                  <input
                    type="text"
                    value={newGuild.name}
                    onChange={(e) => setNewGuild({ ...newGuild, name: e.target.value })}
                    placeholder="Nome da guilda"
                    className="steampunk-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#C9B896] mb-2">Descrição</label>
                  <textarea
                    value={newGuild.description}
                    onChange={(e) => setNewGuild({ ...newGuild, description: e.target.value })}
                    placeholder="Descrição da guilda"
                    className="steampunk-input min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#C9B896] mb-2">Turma</label>
                  <select
                    value={newGuild.classId}
                    onChange={(e) => setNewGuild({ ...newGuild, classId: e.target.value })}
                    className="steampunk-input"
                  >
                    <option value="">Selecione uma turma</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCreateGuildSubmit} className="flex-1 btn-primary">
                    Criar
                  </button>
                  <button onClick={() => setShowCreateGuildModal(false)} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Punishment Modal */}
      <AnimatePresence>
        {showPunishmentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPunishmentModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="steampunk-card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#F5F0E8] mb-4">Aplicar Punição</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#C9B896] mb-2">Tipo</label>
                  <select
                    value={punishment.type}
                    onChange={(e) => setPunishment({ ...punishment, type: e.target.value as PunishmentType })}
                    className="steampunk-input"
                  >
                    <option value="warning">Advertência</option>
                    <option value="xp_loss">Perda de XP</option>
                    <option value="item_loss">Perda de Item</option>
                    <option value="temporary_ban">Banimento Temporário</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#C9B896] mb-2">Motivo</label>
                  <textarea
                    value={punishment.reason}
                    onChange={(e) => setPunishment({ ...punishment, reason: e.target.value })}
                    placeholder="Motivo da punição"
                    className="steampunk-input min-h-[80px]"
                  />
                </div>
                {punishment.type === 'xp_loss' && (
                  <div>
                    <label className="block text-sm text-[#C9B896] mb-2">XP a perder</label>
                    <input
                      type="number"
                      value={punishment.xpLoss}
                      onChange={(e) => setPunishment({ ...punishment, xpLoss: parseInt(e.target.value) })}
                      className="steampunk-input"
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={handlePunishmentSubmit} className="flex-1 btn-danger">
                    Aplicar
                  </button>
                  <button onClick={() => setShowPunishmentModal(null)} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {resetPasswordResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setResetPasswordResult(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="steampunk-card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#F5F0E8] mb-4">Senha Resetada</h3>
              <p className="text-[#C9B896] mb-4">A nova senha do aluno é:</p>
              <div className="bg-[#1A1510] p-4 rounded-lg mb-4">
                <code className="text-[#FFD700] font-mono text-lg">{resetPasswordResult}</code>
              </div>
              <p className="text-sm text-[#8B7355] mb-4">Compartilhe esta senha com o aluno de forma segura.</p>
              <button onClick={() => setResetPasswordResult(null)} className="w-full btn-primary">
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
