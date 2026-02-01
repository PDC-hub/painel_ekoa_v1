import { useState, useEffect, useCallback } from 'react';
import type {
  Class,
  Guild,
  Mission,
  GameItem,
  Student,
  CreateClassForm,
  CreateMissionForm,
  CreateGuildForm,
  AddStudentForm,
  ActivityLog,
  LeaderboardEntry,
  Punishment,
} from '@/types';

// Mock Data
const MOCK_CLASSES: Class[] = [
  {
    id: 'class-1',
    name: '7º Ano A',
    teacherId: 'teacher-1',
    students: ['student-1', 'student-2', 'student-3', 'student-4', 'student-5'],
    guilds: [],
    createdAt: new Date('2024-02-01'),
    inviteCode: 'NQC7A2024',
  },
  {
    id: 'class-2',
    name: '8º Ano B',
    teacherId: 'teacher-1',
    students: ['student-6', 'student-7', 'student-8'],
    guilds: [],
    createdAt: new Date('2024-02-15'),
    inviteCode: 'NQC8B2024',
  },
];

const MOCK_GUILDS: Guild[] = [
  {
    id: 'guild-1',
    name: 'Guerreiros do Vapor',
    classId: 'class-1',
    members: ['student-1', 'student-2', 'student-3'],
    leaderId: 'student-1',
    emblem: 'gear',
    color: '#B87333',
    totalXp: 5250,
    level: 3,
    description: 'Forjados no vapor e na sabedoria ancestral',
  },
  {
    id: 'guild-2',
    name: 'Máscaras de Bronze',
    classId: 'class-1',
    members: ['student-4', 'student-5'],
    leaderId: 'student-4',
    emblem: 'mask',
    color: '#D4AF37',
    totalXp: 3200,
    level: 2,
    description: 'Guardiões dos conhecimentos antigos',
  },
];

const MOCK_MISSIONS: Mission[] = [
  {
    id: 'mission-1',
    title: 'Exploradores da Célula',
    description: 'Estude a estrutura das células e complete o quiz sobre organelos.',
    type: 'weekly',
    subject: 'biology',
    difficulty: 'medium',
    xpReward: 150,
    classId: 'class-1',
    createdBy: 'teacher-1',
    createdAt: new Date('2024-01-20'),
    deadline: new Date('2024-01-27'),
  },
  {
    id: 'mission-2',
    title: 'Alquimistas da Tabela Periódica',
    description: 'Memorize os 20 primeiros elementos da tabela periódica.',
    type: 'daily',
    subject: 'chemistry',
    difficulty: 'easy',
    xpReward: 75,
    classId: 'class-1',
    createdBy: 'teacher-1',
    createdAt: new Date('2024-01-21'),
    deadline: new Date('2024-01-22'),
  },
  {
    id: 'mission-3',
    title: 'Forças da Natureza',
    description: 'Experimento prático sobre as três leis de Newton.',
    type: 'special',
    subject: 'physics',
    difficulty: 'hard',
    xpReward: 300,
    classId: 'class-1',
    createdBy: 'teacher-1',
    createdAt: new Date('2024-01-15'),
    deadline: new Date('2024-01-30'),
  },
  {
    id: 'mission-4',
    title: 'Guardiões do Planeta',
    description: 'Pesquisa sobre biomas brasileiros e sua preservação.',
    type: 'monthly',
    subject: 'ecology',
    difficulty: 'medium',
    xpReward: 250,
    classId: 'class-1',
    createdBy: 'teacher-1',
    createdAt: new Date('2024-01-01'),
    deadline: new Date('2024-01-31'),
  },
];

const MOCK_ITEMS: GameItem[] = [
  {
    id: 'item-1',
    name: 'Machado de Bronze',
    description: 'Um machado forjado em bronze antigo, símbolo de força.',
    type: 'weapon',
    rarity: 'rare',
    icon: '🪓',
    indigenousName: 'Takware',
    indigenousMeaning: 'Machado de guerra Tupi',
    stats: { strength: 5, constitution: 2 },
    levelRequirement: 3,
    tradable: true,
    maxStack: 1,
  },
  {
    id: 'item-2',
    name: 'Máscara Xamânica',
    description: 'Máscara usada em rituais de conhecimento.',
    type: 'accessory',
    rarity: 'epic',
    icon: '🎭',
    indigenousName: 'Karowá',
    indigenousMeaning: 'Máscara ritual',
    stats: { intelligence: 8, wisdom: 5 },
    levelRequirement: 5,
    tradable: false,
    maxStack: 1,
  },
  {
    id: 'item-3',
    name: 'Cocar de Penas Douradas',
    description: 'Cocar cerimonial que confere carisma e sabedoria.',
    type: 'head',
    rarity: 'legendary',
    icon: '👑',
    indigenousName: 'Akará',
    indigenousMeaning: 'Cocar de penas',
    stats: { charisma: 10, wisdom: 5, intelligence: 3 },
    levelRequirement: 10,
    tradable: false,
    maxStack: 1,
  },
  {
    id: 'item-4',
    name: 'Poção de Sabedoria',
    description: 'Elixir que aumenta temporariamente a inteligência.',
    type: 'consumable',
    rarity: 'uncommon',
    icon: '🧪',
    effects: [{ type: 'stat_boost', value: 5, duration: 3600 }],
    tradable: true,
    maxStack: 10,
  },
  {
    id: 'item-5',
    name: 'Armadura de Couro',
    description: 'Proteção básica de couro reforçado.',
    type: 'armor',
    rarity: 'common',
    icon: '🛡️',
    stats: { constitution: 3 },
    levelRequirement: 1,
    tradable: true,
    maxStack: 1,
  },
];

const MOCK_STUDENTS: Student[] = [
  {
    id: 'student-1',
    name: 'João Pereira',
    email: 'joao@escola.edu.br',
    role: 'student',
    avatar: '👨‍🎓',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(),
    classId: 'class-1',
    guildId: 'guild-1',
    level: 5,
    xp: 750,
    xpToNextLevel: 1000,
    totalXp: 2750,
    inventory: [{ itemId: 'item-1', quantity: 1, acquiredAt: new Date(), equipped: true }],
    equippedItems: { weapon: 'item-1' },
    stats: { strength: 8, intelligence: 12, wisdom: 10, dexterity: 9, constitution: 11, charisma: 7 },
    achievements: ['achievement-1', 'achievement-2'],
    completedMissions: ['mission-1', 'mission-2'],
    punishments: [],
  },
  {
    id: 'student-2',
    name: 'Maria Santos',
    email: 'maria@escola.edu.br',
    role: 'student',
    avatar: '👩‍🎓',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(),
    classId: 'class-1',
    guildId: 'guild-1',
    level: 4,
    xp: 500,
    xpToNextLevel: 750,
    totalXp: 1750,
    inventory: [],
    equippedItems: {},
    stats: { strength: 6, intelligence: 14, wisdom: 12, dexterity: 8, constitution: 9, charisma: 10 },
    achievements: ['achievement-1'],
    completedMissions: ['mission-1'],
    punishments: [],
  },
  {
    id: 'student-3',
    name: 'Pedro Costa',
    email: 'pedro@escola.edu.br',
    role: 'student',
    avatar: '🧑‍🎓',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(),
    classId: 'class-1',
    guildId: 'guild-1',
    level: 3,
    xp: 300,
    xpToNextLevel: 500,
    totalXp: 1050,
    inventory: [],
    equippedItems: {},
    stats: { strength: 10, intelligence: 8, wisdom: 7, dexterity: 11, constitution: 12, charisma: 6 },
    achievements: [],
    completedMissions: [],
    punishments: [],
  },
  {
    id: 'student-4',
    name: 'Ana Oliveira',
    email: 'ana@escola.edu.br',
    role: 'student',
    avatar: '👩‍🎓',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(),
    classId: 'class-1',
    guildId: 'guild-2',
    level: 6,
    xp: 900,
    xpToNextLevel: 1250,
    totalXp: 3400,
    inventory: [{ itemId: 'item-2', quantity: 1, acquiredAt: new Date(), equipped: true }],
    equippedItems: { accessory1: 'item-2' },
    stats: { strength: 7, intelligence: 15, wisdom: 14, dexterity: 10, constitution: 10, charisma: 11 },
    achievements: ['achievement-1', 'achievement-2', 'achievement-3'],
    completedMissions: ['mission-1', 'mission-2', 'mission-3'],
    punishments: [],
  },
  {
    id: 'student-5',
    name: 'Lucas Ferreira',
    email: 'lucas@escola.edu.br',
    role: 'student',
    avatar: '🧑‍🎓',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(),
    classId: 'class-1',
    guildId: 'guild-2',
    level: 2,
    xp: 200,
    xpToNextLevel: 350,
    totalXp: 550,
    inventory: [],
    equippedItems: {},
    stats: { strength: 9, intelligence: 9, wisdom: 8, dexterity: 10, constitution: 10, charisma: 8 },
    achievements: [],
    completedMissions: [],
    punishments: [],
  },
];

const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    type: 'mission_completed',
    description: 'João Pereira completou "Exploradores da Célula"',
    userId: 'student-1',
    userName: 'João Pereira',
    timestamp: new Date('2024-01-22T10:30:00'),
  },
  {
    id: 'log-2',
    type: 'mission_created',
    description: 'Nova missão "Forças da Natureza" criada',
    userId: 'teacher-1',
    userName: 'Prof. Ana Silva',
    timestamp: new Date('2024-01-21T14:00:00'),
  },
  {
    id: 'log-3',
    type: 'student_joined',
    description: 'Lucas Ferreira entrou para a turma 7º Ano A',
    userId: 'student-5',
    userName: 'Lucas Ferreira',
    timestamp: new Date('2024-01-20T09:15:00'),
  },
];

// Storage keys
const STORAGE_KEYS = {
  classes: 'naturequest_classes',
  guilds: 'naturequest_guilds',
  missions: 'naturequest_missions',
  students: 'naturequest_students',
  items: 'naturequest_items',
  achievements: 'naturequest_achievements',
  activityLogs: 'naturequest_activity_logs',
};

export function useGameData() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [items, setItems] = useState<GameItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const loadedClasses = localStorage.getItem(STORAGE_KEYS.classes);
      const loadedGuilds = localStorage.getItem(STORAGE_KEYS.guilds);
      const loadedMissions = localStorage.getItem(STORAGE_KEYS.missions);
      const loadedStudents = localStorage.getItem(STORAGE_KEYS.students);
      const loadedItems = localStorage.getItem(STORAGE_KEYS.items);
      const loadedActivityLogs = localStorage.getItem(STORAGE_KEYS.activityLogs);

      setClasses(loadedClasses ? JSON.parse(loadedClasses) : MOCK_CLASSES);
      setGuilds(loadedGuilds ? JSON.parse(loadedGuilds) : MOCK_GUILDS);
      setMissions(loadedMissions ? JSON.parse(loadedMissions) : MOCK_MISSIONS);
      setStudents(loadedStudents ? JSON.parse(loadedStudents) : MOCK_STUDENTS);
      setItems(loadedItems ? JSON.parse(loadedItems) : MOCK_ITEMS);
      setActivityLogs(loadedActivityLogs ? JSON.parse(loadedActivityLogs) : MOCK_ACTIVITY_LOGS);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.classes, JSON.stringify(classes));
      localStorage.setItem(STORAGE_KEYS.guilds, JSON.stringify(guilds));
      localStorage.setItem(STORAGE_KEYS.missions, JSON.stringify(missions));
      localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(students));
      localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(items));
      localStorage.setItem(STORAGE_KEYS.activityLogs, JSON.stringify(activityLogs));
    }
  }, [classes, guilds, missions, students, items, activityLogs, isLoading]);

  // Class Operations
  const createClass = useCallback((data: CreateClassForm, teacherId: string): Class => {
    const newClass: Class = {
      id: `class-${Date.now()}`,
      name: data.name,
      teacherId,
      students: [],
      guilds: [],
      createdAt: new Date(),
      inviteCode: `NQ${data.name.replace(/\s/g, '').substring(0, 3).toUpperCase()}${Date.now().toString(36).substring(0, 4).toUpperCase()}`,
    };
    setClasses(prev => [...prev, newClass]);
    return newClass;
  }, []);

  const deleteClass = useCallback((classId: string) => {
    setClasses(prev => prev.filter(c => c.id !== classId));
    setGuilds(prev => prev.filter(g => g.classId !== classId));
    setMissions(prev => prev.filter(m => m.classId !== classId));
  }, []);

  // Guild Operations
  const createGuild = useCallback((data: CreateGuildForm): Guild => {
    const newGuild: Guild = {
      id: `guild-${Date.now()}`,
      name: data.name,
      classId: data.classId,
      members: [],
      leaderId: '',
      emblem: data.emblem,
      color: data.color,
      totalXp: 0,
      level: 1,
      description: data.description,
    };
    setGuilds(prev => [...prev, newGuild]);
    return newGuild;
  }, []);

  const addStudentToGuild = useCallback((guildId: string, studentId: string) => {
    setGuilds(prev => prev.map(g => 
      g.id === guildId 
        ? { ...g, members: [...g.members, studentId] }
        : g
    ));
    setStudents(prev => prev.map(s =>
      s.id === studentId
        ? { ...s, guildId }
        : s
    ));
  }, []);

  const removeStudentFromGuild = useCallback((guildId: string, studentId: string) => {
    setGuilds(prev => prev.map(g => 
      g.id === guildId 
        ? { ...g, members: g.members.filter(m => m !== studentId) }
        : g
    ));
    setStudents(prev => prev.map(s =>
      s.id === studentId
        ? { ...s, guildId: undefined }
        : s
    ));
  }, []);

  // Mission Operations
  const createMission = useCallback((data: CreateMissionForm): Mission => {
    const newMission: Mission = {
      id: `mission-${Date.now()}`,
      title: data.title,
      description: data.description,
      type: data.type,
      subject: data.subject,
      difficulty: data.difficulty,
      xpReward: data.xpReward,
      classId: data.classId,
      createdBy: data.classId,
      createdAt: new Date(),
      deadline: data.deadline,
    };
    setMissions(prev => [...prev, newMission]);
    return newMission;
  }, []);

  const deleteMission = useCallback((missionId: string) => {
    setMissions(prev => prev.filter(m => m.id !== missionId));
  }, []);

  const completeMission = useCallback((missionId: string, studentId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    const xpEarned = mission.xpReward;
    
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      
      const newXp = s.xp + xpEarned;
      const newTotalXp = s.totalXp + xpEarned;
      let newLevel = s.level;
      let newXpToNext = s.xpToNextLevel;
      
      // Check for level up
      if (newXp >= s.xpToNextLevel) {
        newLevel = s.level + 1;
        newXpToNext = Math.floor(s.xpToNextLevel * 1.5);
      }
      
      return {
        ...s,
        xp: newXp % newXpToNext,
        xpToNextLevel: newXpToNext,
        totalXp: newTotalXp,
        level: newLevel,
        completedMissions: [...s.completedMissions, missionId],
      };
    }));

    // Add activity log
    const student = students.find(s => s.id === studentId);
    if (student) {
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        type: 'mission_completed',
        description: `${student.name} completou "${mission.title}"`,
        userId: studentId,
        userName: student.name,
        timestamp: new Date(),
      };
      setActivityLogs(prev => [newLog, ...prev]);
    }
  }, [missions, students]);

  // Student Operations
  const addStudent = useCallback((data: AddStudentForm): Student => {
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'student',
      createdAt: new Date(),
      lastLogin: new Date(),
      classId: data.classId,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      totalXp: 0,
      inventory: [],
      equippedItems: {},
      stats: {
        strength: 5,
        intelligence: 5,
        wisdom: 5,
        dexterity: 5,
        constitution: 5,
        charisma: 5,
      },
      achievements: [],
      completedMissions: [],
      punishments: [],
    };
    setStudents(prev => [...prev, newStudent]);
    
    // Update class
    setClasses(prev => prev.map(c =>
      c.id === data.classId
        ? { ...c, students: [...c.students, newStudent.id] }
        : c
    ));
    
    return newStudent;
  }, []);

  const removeStudent = useCallback((studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setClasses(prev => prev.map(c =>
        c.id === student.classId
          ? { ...c, students: c.students.filter(s => s !== studentId) }
          : c
      ));
    }
    setStudents(prev => prev.filter(s => s.id !== studentId));
  }, [students]);

  const resetStudentPassword = useCallback((): string => {
    const newPassword = Math.random().toString(36).substring(2, 10);
    // In a real app, this would update the password in the backend
    return newPassword;
  }, []);

  // Punishment Operations
  const givePunishment = useCallback((studentId: string, punishment: Omit<Punishment, 'id' | 'givenAt'>) => {
    const newPunishment: Punishment = {
      ...punishment,
      id: `punishment-${Date.now()}`,
      givenAt: new Date(),
    };
    
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      
      const updatedStudent = { ...s, punishments: [...s.punishments, newPunishment] };
      
      // Apply XP loss
      if (punishment.xpLoss) {
        updatedStudent.xp = Math.max(0, updatedStudent.xp - punishment.xpLoss);
        updatedStudent.totalXp = Math.max(0, updatedStudent.totalXp - punishment.xpLoss);
      }
      
      // Apply item loss
      if (punishment.itemLoss) {
        updatedStudent.inventory = updatedStudent.inventory.filter(
          item => !punishment.itemLoss?.includes(item.itemId)
        );
      }
      
      return updatedStudent;
    }));
  }, []);

  // Item Operations
  const giveItem = useCallback((studentId: string, itemId: string, quantity: number = 1) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      
      const existingItem = s.inventory.find(i => i.itemId === itemId);
      if (existingItem) {
        return {
          ...s,
          inventory: s.inventory.map(i =>
            i.itemId === itemId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      
      return {
        ...s,
        inventory: [...s.inventory, {
          itemId,
          quantity,
          acquiredAt: new Date(),
          equipped: false,
        }],
      };
    }));
  }, []);

  const equipItem = useCallback((studentId: string, itemId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      
      const item = items.find(i => i.id === itemId);
      if (!item) return s;
      
      const slot = item.type === 'weapon' ? 'weapon' :
                   item.type === 'head' ? 'head' :
                   item.type === 'armor' ? 'body' :
                   item.type === 'accessory' ? 'accessory1' : null;
      
      if (!slot) return s;
      
      return {
        ...s,
        inventory: s.inventory.map(i =>
          i.itemId === itemId
            ? { ...i, equipped: true }
            : i
        ),
        equippedItems: {
          ...s.equippedItems,
          [slot]: itemId,
        },
      };
    }));
  }, [items]);

  const unequipItem = useCallback((studentId: string, itemId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      
      const equippedSlot = Object.entries(s.equippedItems).find(([, id]) => id === itemId)?.[0];
      if (!equippedSlot) return s;
      
      const newEquippedItems = { ...s.equippedItems };
      delete newEquippedItems[equippedSlot as keyof typeof newEquippedItems];
      
      return {
        ...s,
        inventory: s.inventory.map(i =>
          i.itemId === itemId
            ? { ...i, equipped: false }
            : i
        ),
        equippedItems: newEquippedItems,
      };
    }));
  }, []);

  // Getters
  const getClassById = useCallback((classId: string) => {
    return classes.find(c => c.id === classId);
  }, [classes]);

  const getGuildById = useCallback((guildId: string) => {
    return guilds.find(g => g.id === guildId);
  }, [guilds]);

  const getStudentById = useCallback((studentId: string) => {
    return students.find(s => s.id === studentId);
  }, [students]);

  const getMissionById = useCallback((missionId: string) => {
    return missions.find(m => m.id === missionId);
  }, [missions]);

  const getItemById = useCallback((itemId: string) => {
    return items.find(i => i.id === itemId);
  }, [items]);

  const getStudentsByClass = useCallback((classId: string) => {
    return students.filter(s => s.classId === classId);
  }, [students]);

  const getMissionsByClass = useCallback((classId: string) => {
    return missions.filter(m => m.classId === classId);
  }, [missions]);

  const getGuildsByClass = useCallback((classId: string) => {
    return guilds.filter(g => g.classId === classId);
  }, [guilds]);

  const getLeaderboard = useCallback((classId?: string): LeaderboardEntry[] => {
    const filteredStudents = classId 
      ? students.filter(s => s.classId === classId)
      : students;
    
    return filteredStudents
      .sort((a, b) => b.totalXp - a.totalXp)
      .map((s, index) => ({
        rank: index + 1,
        studentId: s.id,
        studentName: s.name,
        avatar: s.avatar,
        level: s.level,
        xp: s.totalXp,
        guildName: guilds.find(g => g.id === s.guildId)?.name,
      }));
  }, [students, guilds]);

  const getStudentInventory = useCallback((studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return [];
    
    return student.inventory.map(invItem => {
      const item = items.find(i => i.id === invItem.itemId);
      return { ...invItem, item };
    }).filter(i => i.item) as { itemId: string; quantity: number; acquiredAt: Date; equipped: boolean; item: GameItem }[];
  }, [students, items]);

  return {
    // Data
    classes,
    guilds,
    missions,
    students,
    items,
    activityLogs,
    isLoading,
    
    // Operations
    createClass,
    deleteClass,
    createGuild,
    addStudentToGuild,
    removeStudentFromGuild,
    createMission,
    deleteMission,
    completeMission,
    addStudent,
    removeStudent,
    resetStudentPassword,
    givePunishment,
    giveItem,
    equipItem,
    unequipItem,
    
    // Getters
    getClassById,
    getGuildById,
    getStudentById,
    getMissionById,
    getItemById,
    getStudentsByClass,
    getMissionsByClass,
    getGuildsByClass,
    getLeaderboard,
    getStudentInventory,
  };
}
