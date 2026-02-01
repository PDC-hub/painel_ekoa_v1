import { useCallback, useState } from 'react';
import { useAzureAuth } from './useAzureAuth';
import { apiEndpoints } from '@/config/azure';

interface APIOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

interface APIResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useAzureAPI() {
  const { getAccessToken } = useAzureAuth();
  const [isLoading, setIsLoading] = useState(false);

  const makeRequest = useCallback(async <T>(
    endpoint: string,
    options: APIOptions = {}
  ): Promise<APIResponse<T>> => {
    setIsLoading(true);
    
    try {
      // Get access token for authentication
      const token = await getAccessToken();
      
      if (!token) {
        throw new Error('Não autenticado');
      }

      const url = `${apiEndpoints.base}${endpoint}`;
      
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        data,
        error: null,
        isLoading: false,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        isLoading: false,
      };
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  // Classes API
  const classes = {
    getAll: useCallback(() => makeRequest('/classes'), [makeRequest]),
    getById: useCallback((id: string) => makeRequest(`/classes/${id}`), [makeRequest]),
    create: useCallback((data: unknown) => makeRequest('/classes', { method: 'POST', body: data }), [makeRequest]),
    update: useCallback((id: string, data: unknown) => makeRequest(`/classes/${id}`, { method: 'PUT', body: data }), [makeRequest]),
    delete: useCallback((id: string) => makeRequest(`/classes/${id}`, { method: 'DELETE' }), [makeRequest]),
    getStudents: useCallback((id: string) => makeRequest(`/classes/${id}/students`), [makeRequest]),
  };

  // Students API
  const students = {
    getAll: useCallback(() => makeRequest('/students'), [makeRequest]),
    getById: useCallback((id: string) => makeRequest(`/students/${id}`), [makeRequest]),
    create: useCallback((data: unknown) => makeRequest('/students', { method: 'POST', body: data }), [makeRequest]),
    update: useCallback((id: string, data: unknown) => makeRequest(`/students/${id}`, { method: 'PUT', body: data }), [makeRequest]),
    delete: useCallback((id: string) => makeRequest(`/students/${id}`, { method: 'DELETE' }), [makeRequest]),
    resetPassword: useCallback((id: string) => makeRequest(`/students/${id}/reset-password`, { method: 'POST' }), [makeRequest]),
    getInventory: useCallback((id: string) => makeRequest(`/students/${id}/inventory`), [makeRequest]),
    giveItem: useCallback((id: string, itemId: string) => 
      makeRequest(`/students/${id}/items`, { method: 'POST', body: { itemId } }), [makeRequest]),
    equipItem: useCallback((id: string, itemId: string) => 
      makeRequest(`/students/${id}/equip`, { method: 'POST', body: { itemId } }), [makeRequest]),
  };

  // Missions API
  const missions = {
    getAll: useCallback(() => makeRequest('/missions'), [makeRequest]),
    getById: useCallback((id: string) => makeRequest(`/missions/${id}`), [makeRequest]),
    create: useCallback((data: unknown) => makeRequest('/missions', { method: 'POST', body: data }), [makeRequest]),
    update: useCallback((id: string, data: unknown) => makeRequest(`/missions/${id}`, { method: 'PUT', body: data }), [makeRequest]),
    delete: useCallback((id: string) => makeRequest(`/missions/${id}`, { method: 'DELETE' }), [makeRequest]),
    complete: useCallback((id: string) => makeRequest(`/missions/${id}/complete`, { method: 'POST' }), [makeRequest]),
  };

  // Guilds API
  const guilds = {
    getAll: useCallback(() => makeRequest('/guilds'), [makeRequest]),
    getById: useCallback((id: string) => makeRequest(`/guilds/${id}`), [makeRequest]),
    create: useCallback((data: unknown) => makeRequest('/guilds', { method: 'POST', body: data }), [makeRequest]),
    update: useCallback((id: string, data: unknown) => makeRequest(`/guilds/${id}`, { method: 'PUT', body: data }), [makeRequest]),
    delete: useCallback((id: string) => makeRequest(`/guilds/${id}`, { method: 'DELETE' }), [makeRequest]),
    addMember: useCallback((id: string, studentId: string) => 
      makeRequest(`/guilds/${id}/members`, { method: 'POST', body: { studentId } }), [makeRequest]),
    removeMember: useCallback((id: string, studentId: string) => 
      makeRequest(`/guilds/${id}/members/${studentId}`, { method: 'DELETE' }), [makeRequest]),
  };

  // Items API
  const items = {
    getAll: useCallback(() => makeRequest('/items'), [makeRequest]),
    getById: useCallback((id: string) => makeRequest(`/items/${id}`), [makeRequest]),
  };

  // Leaderboard API
  const leaderboard = {
    getAll: useCallback(() => makeRequest('/leaderboard'), [makeRequest]),
    getByClass: useCallback((classId: string) => makeRequest(`/leaderboard?classId=${classId}`), [makeRequest]),
  };

  // Activity logs API
  const activity = {
    getAll: useCallback(() => makeRequest('/activity'), [makeRequest]),
    getRecent: useCallback((limit: number = 10) => makeRequest(`/activity?limit=${limit}`), [makeRequest]),
  };

  // Punishments API
  const punishments = {
    give: useCallback((studentId: string, data: unknown) => 
      makeRequest(`/students/${studentId}/punishments`, { method: 'POST', body: data }), [makeRequest]),
    getByStudent: useCallback((studentId: string) => makeRequest(`/students/${studentId}/punishments`), [makeRequest]),
  };

  return {
    isLoading,
    classes,
    students,
    missions,
    guilds,
    items,
    leaderboard,
    activity,
    punishments,
    makeRequest,
  };
}
