import { useState, useEffect } from 'react';
import { useAzureAuth } from '@/hooks/useAzureAuth';
import { useAzureAPI } from '@/hooks/useAzureAPI';
import { AzureLoginButton } from '@/components/AzureLoginButton';
import { AzureAuthProvider } from '@/providers/AzureAuthProvider';
import { StudentDashboard } from '@/components/StudentDashboard';
import { TeacherDashboard } from '@/components/TeacherDashboard';
import { SteamPunkGear } from '@/components/SteamPunkGear';
import type { Student, Class, Guild, Mission, GameItem } from '@/types';
import './App.css';

// Componente principal com Azure Auth
function AppAzureContent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading: authLoading, 
    error: authError,
    isTeacher,
    isStudent,
    logout,
    validateInstitutionalEmail,
  } = useAzureAuth();

  const api = useAzureAPI();
  
  const [appData, setAppData] = useState<{
    student: Student | null;
    classInfo: Class | null;
    guildInfo: Guild | null;
    activeMissions: Mission[];
    availableMissions: Mission[];
    leaderboard: { rank: number; studentName: string; avatar?: string; level: number; xp: number; guildName?: string }[];
    inventory: { itemId: string; quantity: number; acquiredAt: Date; equipped: boolean; item: GameItem }[];
  }>({
    student: null,
    classInfo: null,
    guildInfo: null,
    activeMissions: [],
    availableMissions: [],
    leaderboard: [],
    inventory: [],
  });

  const [isLoadingData, setIsLoadingData] = useState(false);

  // Carregar dados do usuário após autenticação
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setIsLoadingData(true);
    
    try {
      if (isStudent) {
        // Carregar dados do aluno
        const [studentRes, missionsRes, leaderboardRes, inventoryRes] = await Promise.all([
          api.students.getById(user.id),
          api.missions.getAll(),
          api.leaderboard.getAll(),
          api.students.getInventory(user.id),
        ]);

        if (studentRes.data && missionsRes.data && leaderboardRes.data) {
          const student = studentRes.data as Student;
          const missions = missionsRes.data as Mission[];
          const leaderboard = leaderboardRes.data as { rank: number; studentName: string; avatar?: string; level: number; xp: number; guildName?: string }[];
          const inventory = inventoryRes.data || [];

          // Carregar informações da turma e guilda
          let classInfo = null;
          let guildInfo = null;

          if (student.classId) {
            const classRes = await api.classes.getById(student.classId);
            classInfo = classRes.data as Class;
          }

          if (student.guildId) {
            const guildRes = await api.guilds.getById(student.guildId);
            guildInfo = guildRes.data as Guild;
          }

          const availableMissions = missions.filter(m => m.classId === student.classId);
          const activeMissions = availableMissions.filter(m => !student.completedMissions?.includes(m.id));

          setAppData({
            student,
            classInfo,
            guildInfo,
            activeMissions,
            availableMissions,
            leaderboard,
            inventory,
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Loading screen
  if (authLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-[#1A1510] flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <SteamPunkGear size={80} color="#B87333" speed={2} />
            <SteamPunkGear 
              size={50} 
              color="#D4AF37" 
              speed={1.5} 
              reverse 
              className="absolute -bottom-2 -right-8" 
            />
          </div>
          <h2 className="text-2xl font-bold text-[#F5F0E8] mb-2">NatureQuest</h2>
          <p className="text-[#8B7355]">
            {authLoading ? 'Conectando ao Microsoft 365...' : 'Carregando dados...'}
          </p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1A1510] flex items-center justify-center p-4">
        <AzureLoginButton />
      </div>
    );
  }

  // Validate institutional email
  if (!validateInstitutionalEmail()) {
    return (
      <div className="min-h-screen bg-[#1A1510] flex items-center justify-center p-4">
        <div className="steampunk-card max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Acesso Negado</h2>
          <p className="text-[#C9B896] mb-6">
            Seu email <strong>{user.email}</strong> não pertence a um domínio institucional permitido.
          </p>
          <p className="text-sm text-[#8B7355] mb-6">
            Domínios permitidos: @portalsesisp.org.br
          </p>
          <button onClick={logout} className="btn-primary">
            Sair e tentar outra conta
          </button>
        </div>
      </div>
    );
  }

  // Student Dashboard
  if (isStudent && appData.student && appData.classInfo) {
    return (
      <StudentDashboard
        student={appData.student}
        classInfo={appData.classInfo}
        guildInfo={appData.guildInfo || undefined}
        activeMissions={appData.activeMissions}
        availableMissions={appData.availableMissions}
        leaderboard={appData.leaderboard}
        inventory={appData.inventory}
        onCompleteMission={async (missionId) => {
          await api.missions.complete(missionId);
          await loadUserData();
        }}
        onEquipItem={async (itemId) => {
          await api.students.equipItem(user.id, itemId);
          await loadUserData();
        }}
        onUnequipItem={async (itemId) => {
          // Implementar desequipar via API
          await loadUserData();
        }}
        onLogout={logout}
      />
    );
  }

  // Teacher Dashboard
  if (isTeacher) {
    // Para professores, carregar todos os dados
    return (
      <TeacherDashboardAzure 
        teacher={user}
        api={api}
        onLogout={logout}
      />
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-[#1A1510] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#8B7355]">Algo deu errado. Por favor, tente novamente.</p>
        <button onClick={logout} className="btn-primary mt-4">Voltar ao Login</button>
      </div>
    </div>
  );
}

// Componente do Dashboard do Professor com Azure API
function TeacherDashboardAzure({ 
  teacher, 
  api, 
  onLogout 
}: { 
  teacher: { id: string; name: string; email: string; role: 'teacher' | 'student' | 'admin'; avatar?: string };
  api: ReturnType<typeof useAzureAPI>;
  onLogout: () => void;
}) {
  const [data, setData] = useState({
    classes: [] as Class[],
    guilds: [] as Guild[],
    missions: [] as Mission[],
    students: [] as Student[],
    activityLogs: [] as { id: string; type: string; description: string; userName: string; timestamp: Date }[],
    leaderboard: [] as { rank: number; studentName: string; level: number; xp: number; guildName?: string }[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [classesRes, guildsRes, missionsRes, studentsRes, leaderboardRes] = await Promise.all([
        api.classes.getAll(),
        api.guilds.getAll(),
        api.missions.getAll(),
        api.students.getAll(),
        api.leaderboard.getAll(),
      ]);

      setData({
        classes: (classesRes.data || []) as Class[],
        guilds: (guildsRes.data || []) as Guild[],
        missions: (missionsRes.data || []) as Mission[],
        students: (studentsRes.data || []) as Student[],
        activityLogs: [], // Carregar separadamente se necessário
        leaderboard: (leaderboardRes.data || []) as { rank: number; studentName: string; level: number; xp: number; guildName?: string }[],
      });
    } catch (error) {
      console.error('Error loading teacher data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1510] flex items-center justify-center">
        <div className="text-center">
          <SteamPunkGear size={60} color="#B87333" speed={2} />
          <p className="text-[#8B7355] mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <TeacherDashboard
      teacher={{
        ...teacher,
        createdAt: new Date(),
        lastLogin: new Date(),
        classes: data.classes.map(c => c.id),
      }}
      classes={data.classes}
      guilds={data.guilds}
      missions={data.missions}
      students={data.students}
      activityLogs={data.activityLogs}
      leaderboard={data.leaderboard}
      onCreateClass={async (formData) => {
        await api.classes.create({ ...formData, teacherId: teacher.id });
        await loadAllData();
      }}
      onDeleteClass={async (id) => {
        await api.classes.delete(id);
        await loadAllData();
      }}
      onCreateGuild={async (formData) => {
        await api.guilds.create(formData);
        await loadAllData();
      }}
      onAddStudent={async (formData) => {
        await api.students.create(formData);
        await loadAllData();
      }}
      onRemoveStudent={async (id) => {
        await api.students.delete(id);
        await loadAllData();
      }}
      onResetPassword={() => {
        // Implementar reset de senha via Azure AD
        return Math.random().toString(36).substring(2, 10);
      }}
      onCreateMission={async (formData) => {
        await api.missions.create({ ...formData, createdBy: teacher.id });
        await loadAllData();
      }}
      onDeleteMission={async (id) => {
        await api.missions.delete(id);
        await loadAllData();
      }}
      onGivePunishment={async (studentId, punishment) => {
        await api.punishments.give(studentId, punishment);
        await loadAllData();
      }}
      onGiveItem={async (studentId, itemId) => {
        await api.students.giveItem(studentId, itemId);
        await loadAllData();
      }}
      onCloudConnect={async () => true}
      onCloudDisconnect={() => {}}
      onCreateBackup={async () => true}
      onExportData={() => {}}
      onImportData={async () => true}
      isCloudConnected={false}
      cloudProvider={null}
      onLogout={onLogout}
    />
  );
}

// App principal com provider
function AppAzure() {
  return (
    <AzureAuthProvider>
      <AppAzureContent />
    </AzureAuthProvider>
  );
}

export default AppAzure;
