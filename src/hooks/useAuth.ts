import { useState, useEffect, useCallback } from 'react';
import type { User, Teacher, Student, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

// Mock data for demo
const MOCK_TEACHER: Teacher = {
  id: 'teacher-1',
  name: 'Prof. Ana Silva',
  email: 'ana.silva@escola.edu.br',
  role: 'teacher',
  avatar: '👩‍🏫',
  createdAt: new Date('2024-01-15'),
  lastLogin: new Date(),
  classes: ['class-1', 'class-2'],
  cloudProvider: 'local',
};

const MOCK_STUDENT: Student = {
  id: 'student-1',
  name: 'João Pereira',
  email: 'joao.pereira@escola.edu.br',
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
  inventory: [],
  equippedItems: {},
  stats: {
    strength: 8,
    intelligence: 12,
    wisdom: 10,
    dexterity: 9,
    constitution: 11,
    charisma: 7,
  },
  achievements: ['achievement-1', 'achievement-2'],
  completedMissions: ['mission-1', 'mission-2', 'mission-3'],
  punishments: [],
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('naturequest_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setState({
          user: parsed,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch {
        localStorage.removeItem('naturequest_user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Demo login logic
    if (credentials.email && credentials.password) {
      const mockUser = credentials.role === 'teacher' ? MOCK_TEACHER : MOCK_STUDENT;
      
      localStorage.setItem('naturequest_user', JSON.stringify(mockUser));
      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    }
    
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: 'Credenciais inválidas',
    }));
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('naturequest_user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const resetPassword = useCallback(async (): Promise<boolean> => {
    // Simulate password reset
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, ...updates };
      localStorage.setItem('naturequest_user', JSON.stringify(updated));
      return { ...prev, user: updated };
    });
  }, []);

  const isTeacher = state.user?.role === 'teacher';
  const isStudent = state.user?.role === 'student';

  return {
    ...state,
    isTeacher,
    isStudent,
    login,
    logout,
    resetPassword,
    updateUser,
  };
}
