// User Types
export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface Teacher extends User {
  role: 'teacher';
  classes: string[];
  cloudProvider?: CloudProvider;
  cloudConfig?: CloudConfig;
}

export interface Student extends User {
  role: 'student';
  classId: string;
  guildId?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  inventory: InventoryItem[];
  equippedItems: EquippedItems;
  stats: PlayerStats;
  achievements: string[];
  completedMissions: string[];
  punishments: Punishment[];
}

// Cloud Storage Types
export type CloudProvider = 'google_drive' | 'dropbox' | 'onedrive' | 'local';

export interface CloudConfig {
  provider: CloudProvider;
  folderId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

// Class/Guild Types
export interface Class {
  id: string;
  name: string;
  teacherId: string;
  students: string[];
  guilds: Guild[];
  createdAt: Date;
  inviteCode: string;
}

export interface Guild {
  id: string;
  name: string;
  classId: string;
  members: string[];
  leaderId: string;
  emblem: string;
  color: string;
  totalXp: number;
  level: number;
  description?: string;
}

// Mission Types
export type MissionType = 'daily' | 'weekly' | 'monthly' | 'special';
export type MissionSubject = 'biology' | 'chemistry' | 'physics' | 'geology' | 'ecology' | 'general';
export type MissionDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  subject: MissionSubject;
  difficulty: MissionDifficulty;
  xpReward: number;
  itemReward?: ItemReward;
  deadline?: Date;
  createdBy: string;
  classId: string;
  createdAt: Date;
  requirements?: MissionRequirement[];
  attachments?: string[];
}

export interface MissionRequirement {
  type: 'quiz' | 'assignment' | 'practical' | 'research';
  description: string;
  minScore?: number;
}

export interface ItemReward {
  itemId: string;
  quantity: number;
  chance?: number;
}

// Item Types
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemType = 'weapon' | 'armor' | 'head' | 'accessory' | 'consumable' | 'cosmetic' | 'material';
export type ItemSlot = 'head' | 'body' | 'hands' | 'feet' | 'weapon' | 'accessory1' | 'accessory2';

export interface GameItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
  indigenousName?: string;
  indigenousMeaning?: string;
  stats?: ItemStats;
  effects?: ItemEffect[];
  levelRequirement?: number;
  tradable: boolean;
  maxStack: number;
}

export interface ItemStats {
  strength?: number;
  intelligence?: number;
  wisdom?: number;
  dexterity?: number;
  constitution?: number;
  charisma?: number;
}

export interface ItemEffect {
  type: 'buff' | 'heal' | 'xp_boost' | 'stat_boost';
  value: number;
  duration?: number;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  acquiredAt: Date;
  equipped: boolean;
}

export interface EquippedItems {
  head?: string;
  body?: string;
  hands?: string;
  feet?: string;
  weapon?: string;
  accessory1?: string;
  accessory2?: string;
}

// Player Stats
export interface PlayerStats {
  strength: number;
  intelligence: number;
  wisdom: number;
  dexterity: number;
  constitution: number;
  charisma: number;
}

// Punishment Types
export type PunishmentType = 'warning' | 'xp_loss' | 'item_loss' | 'temporary_ban';

export interface Punishment {
  id: string;
  type: PunishmentType;
  reason: string;
  xpLoss?: number;
  itemLoss?: string[];
  duration?: number;
  givenBy: string;
  givenAt: Date;
  expiresAt?: Date;
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  requirement: AchievementRequirement;
}

export interface AchievementRequirement {
  type: 'level' | 'missions' | 'xp' | 'items' | 'guild';
  value: number;
  subject?: MissionSubject;
}

// Activity Log
export interface ActivityLog {
  id: string;
  type: 'mission_created' | 'mission_completed' | 'student_joined' | 'guild_created' | 'item_rewarded' | 'punishment_given';
  description: string;
  userId: string;
  userName: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Dashboard Data
export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  avatar?: string;
  level: number;
  xp: number;
  guildName?: string;
}

// Form Types
export interface CreateClassForm {
  name: string;
}

export interface CreateMissionForm {
  title: string;
  description: string;
  type: MissionType;
  subject: MissionSubject;
  difficulty: MissionDifficulty;
  xpReward: number;
  classId: string;
  deadline?: Date;
  itemRewards?: string[];
}

export interface CreateGuildForm {
  name: string;
  classId: string;
  description?: string;
  emblem: string;
  color: string;
}

export interface AddStudentForm {
  name: string;
  email: string;
  classId: string;
}

// Theme Colors for Guilds
export const GUILD_COLORS = [
  '#B87333', // Copper
  '#D4AF37', // Brass
  '#CD853F', // Terracotta
  '#4682B4', // Steel Blue
  '#6B8E23', // Olive
  '#8B4513', // Saddle Brown
  '#9932CC', // Dark Orchid
  '#2E8B57', // Sea Green
] as const;

// Emblem Options
export const GUILD_EMBLEMS = [
  'gear',
  'feather',
  'mask',
  'totem',
  'compass',
  'flame',
  'tree',
  'mountain',
] as const;

// Level XP Requirements
export const LEVEL_XP_REQUIREMENTS: Record<number, number> = {
  1: 100,
  2: 250,
  3: 500,
  4: 1000,
  5: 1750,
  6: 2750,
  7: 4000,
  8: 5500,
  9: 7250,
  10: 9250,
  11: 11500,
  12: 14000,
  13: 16750,
  14: 19750,
  15: 23000,
  16: 26500,
  17: 30250,
  18: 34250,
  19: 38500,
  20: 43000,
};

// Rarity Colors
export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#8B7355',
  uncommon: '#6B8E23',
  rare: '#4682B4',
  epic: '#9932CC',
  legendary: '#FFD700',
};

// Rarity Names in Portuguese
export const RARITY_NAMES: Record<ItemRarity, string> = {
  common: 'Comum',
  uncommon: 'Incomum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
};

// Subject Names in Portuguese
export const SUBJECT_NAMES: Record<MissionSubject, string> = {
  biology: 'Biologia',
  chemistry: 'Química',
  physics: 'Física',
  geology: 'Geologia',
  ecology: 'Ecologia',
  general: 'Geral',
};

// Difficulty Names in Portuguese
export const DIFFICULTY_NAMES: Record<MissionDifficulty, string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
  expert: 'Especialista',
};

// Mission Type Names in Portuguese
export const MISSION_TYPE_NAMES: Record<MissionType, string> = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal',
  special: 'Especial',
};
