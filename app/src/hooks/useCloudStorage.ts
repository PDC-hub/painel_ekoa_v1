import { useState, useCallback } from 'react';
import type { CloudProvider } from '@/types';

interface CloudStorageState {
  isConnected: boolean;
  isConnecting: boolean;
  provider: CloudProvider | null;
  error: string | null;
}

interface BackupData {
  timestamp: Date;
  classes: unknown[];
  guilds: unknown[];
  missions: unknown[];
  students: unknown[];
  items: unknown[];
  achievements: unknown[];
  activityLogs: unknown[];
}

export function useCloudStorage() {
  const [state, setState] = useState<CloudStorageState>({
    isConnected: false,
    isConnecting: false,
    provider: null,
    error: null,
  });

  const connect = useCallback(async (provider: CloudProvider): Promise<boolean> => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store connection in localStorage for demo
      localStorage.setItem('naturequest_cloud_provider', provider);
      localStorage.setItem('naturequest_cloud_connected', 'true');
      
      setState({
        isConnected: true,
        isConnecting: false,
        provider,
        error: null,
      });
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: 'Falha ao conectar ao serviço de nuvem',
      }));
      return false;
    }
  }, []);

  const disconnect = useCallback(async (): Promise<void> => {
    localStorage.removeItem('naturequest_cloud_provider');
    localStorage.removeItem('naturequest_cloud_connected');
    
    setState({
      isConnected: false,
      isConnecting: false,
      provider: null,
      error: null,
    });
  }, []);

  const createBackup = useCallback(async (): Promise<boolean> => {
    if (!state.isConnected) {
      setState(prev => ({ ...prev, error: 'Não conectado à nuvem' }));
      return false;
    }
    
    try {
      // Collect all data from localStorage
      const backupData: BackupData = {
        timestamp: new Date(),
        classes: JSON.parse(localStorage.getItem('naturequest_classes') || '[]'),
        guilds: JSON.parse(localStorage.getItem('naturequest_guilds') || '[]'),
        missions: JSON.parse(localStorage.getItem('naturequest_missions') || '[]'),
        students: JSON.parse(localStorage.getItem('naturequest_students') || '[]'),
        items: JSON.parse(localStorage.getItem('naturequest_items') || '[]'),
        achievements: JSON.parse(localStorage.getItem('naturequest_achievements') || '[]'),
        activityLogs: JSON.parse(localStorage.getItem('naturequest_activity_logs') || '[]'),
      };
      
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store backup metadata
      const backups = JSON.parse(localStorage.getItem('naturequest_backups') || '[]');
      backups.push({
        id: `backup-${Date.now()}`,
        timestamp: backupData.timestamp,
        provider: state.provider,
        size: JSON.stringify(backupData).length,
      });
      localStorage.setItem('naturequest_backups', JSON.stringify(backups));
      
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Falha ao criar backup' }));
      return false;
    }
  }, [state.isConnected, state.provider]);

  const restoreBackup = useCallback(async (): Promise<boolean> => {
    if (!state.isConnected) {
      setState(prev => ({ ...prev, error: 'Não conectado à nuvem' }));
      return false;
    }
    
    try {
      // Simulate download and restore
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would download from cloud
      // For demo, we'll just confirm the action
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Falha ao restaurar backup' }));
      return false;
    }
  }, [state.isConnected]);

  const getBackups = useCallback((): { id: string; timestamp: Date; provider: CloudProvider; size: number }[] => {
    return JSON.parse(localStorage.getItem('naturequest_backups') || '[]');
  }, []);

  const exportToFile = useCallback((): void => {
    const data = {
      exportDate: new Date(),
      classes: JSON.parse(localStorage.getItem('naturequest_classes') || '[]'),
      guilds: JSON.parse(localStorage.getItem('naturequest_guilds') || '[]'),
      missions: JSON.parse(localStorage.getItem('naturequest_missions') || '[]'),
      students: JSON.parse(localStorage.getItem('naturequest_students') || '[]'),
      items: JSON.parse(localStorage.getItem('naturequest_items') || '[]'),
      achievements: JSON.parse(localStorage.getItem('naturequest_achievements') || '[]'),
      activityLogs: JSON.parse(localStorage.getItem('naturequest_activity_logs') || '[]'),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naturequest-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const importFromFile = useCallback(async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.classes) localStorage.setItem('naturequest_classes', JSON.stringify(data.classes));
      if (data.guilds) localStorage.setItem('naturequest_guilds', JSON.stringify(data.guilds));
      if (data.missions) localStorage.setItem('naturequest_missions', JSON.stringify(data.missions));
      if (data.students) localStorage.setItem('naturequest_students', JSON.stringify(data.students));
      if (data.items) localStorage.setItem('naturequest_items', JSON.stringify(data.items));
      if (data.achievements) localStorage.setItem('naturequest_achievements', JSON.stringify(data.achievements));
      if (data.activityLogs) localStorage.setItem('naturequest_activity_logs', JSON.stringify(data.activityLogs));
      
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Arquivo inválido' }));
      return false;
    }
  }, []);

  const getProviderName = useCallback((provider: CloudProvider): string => {
    const names: Record<CloudProvider, string> = {
      google_drive: 'Google Drive',
      dropbox: 'Dropbox',
      onedrive: 'OneDrive',
      local: 'Armazenamento Local',
    };
    return names[provider];
  }, []);

  const getProviderIcon = useCallback((provider: CloudProvider): string => {
    const icons: Record<CloudProvider, string> = {
      google_drive: '📁',
      dropbox: '📦',
      onedrive: '☁️',
      local: '💾',
    };
    return icons[provider];
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    createBackup,
    restoreBackup,
    getBackups,
    exportToFile,
    importFromFile,
    getProviderName,
    getProviderIcon,
  };
}
