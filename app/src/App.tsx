import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGameData } from '@/hooks/useGameData';
import { useCloudStorage } from '@/hooks/useCloudStorage';
import { LoginForm } from '@/components/LoginForm';
import { StudentDashboard } from '@/components/StudentDashboard';
import { TeacherDashboard } from '@/components/TeacherDashboard';
import { SteamPunkGear } from '@/components/SteamPunkGear';
import type { UserRole, CreateClassForm, CreateMissionForm, CreateGuildForm, AddStudentForm, CloudProvider } from '@/types';
import './App.css';

function App() {
  const { 
    user, 
    isAuthenticated, 
    isLoading: authLoading, 
    error: authError,
    isTeacher,
    isStudent,
    login, 
    logout 
  } = useAuth();

  const {
    classes,
    guilds,
    missions,
    students,
    activityLogs,
    isLoading: dataLoading,
    createClass,
    deleteClass,
    createGuild,
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
    getClassById,
    getGuildById,
    getStudentById,
    getMissionsByClass,
    getLeaderboard,
    getStudentInventory,
  } = useGameData();

  const {
    isConnected: isCloudConnected,
    provider: cloudProvider,
    connect: connectCloud,
    disconnect: disconnectCloud,
    createBackup,
    exportToFile,
    importFromFile,
  } = useCloudStorage();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (credentials: { email: string; password: string; role: UserRole }) => {
    return await login(credentials);
  };

  const handleCreateClass = (data: CreateClassForm) => {
    if (user?.id) {
      createClass(data, user.id);
    }
  };

  const handleCreateMission = (data: CreateMissionForm) => {
    createMission(data);
  };

  const handleCreateGuild = (data: CreateGuildForm) => {
    createGuild(data);
  };

  const handleAddStudent = (data: AddStudentForm) => {
    addStudent(data);
  };

  const handleCompleteMission = (missionId: string) => {
    if (user?.id) {
      completeMission(missionId, user.id);
    }
  };

  const handleCloudConnect = async (provider: CloudProvider): Promise<boolean> => {
    return await connectCloud(provider);
  };

  const handleCloudDisconnect = () => {
    disconnectCloud();
  };

  const handleCreateBackup = async (): Promise<boolean> => {
    return await createBackup();
  };

  const handleExportData = () => {
    exportToFile();
  };

  const handleImportData = async (file: File): Promise<boolean> => {
    return await importFromFile(file);
  };

  // Loading screen
  if (!isReady || authLoading || dataLoading) {
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
          <p className="text-[#8B7355]">Carregando...</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated || !user) {
    return (
      <LoginForm 
        onLogin={handleLogin} 
        isLoading={authLoading} 
        error={authError} 
      />
    );
  }

  // Student Dashboard
  if (isStudent) {
    const student = getStudentById(user.id);
    if (!student) {
      return (
        <div className="min-h-screen bg-[#1A1510] flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#8B7355]">Erro ao carregar dados do aluno</p>
            <button onClick={logout} className="btn-primary mt-4">Voltar</button>
          </div>
        </div>
      );
    }

    const classInfo = getClassById(student.classId);
    if (!classInfo) {
      return (
        <div className="min-h-screen bg-[#1A1510] flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#8B7355]">Erro ao carregar dados da turma</p>
            <button onClick={logout} className="btn-primary mt-4">Voltar</button>
          </div>
        </div>
      );
    }

    const guildInfo = student.guildId ? getGuildById(student.guildId) : undefined;
    const availableMissions = getMissionsByClass(student.classId);
    const activeMissions = availableMissions.filter(m => !student.completedMissions.includes(m.id));
    const leaderboard = getLeaderboard(student.classId);
    const inventory = getStudentInventory(student.id);

    return (
      <StudentDashboard
        student={student}
        classInfo={classInfo}
        guildInfo={guildInfo}
        activeMissions={activeMissions}
        availableMissions={availableMissions}
        leaderboard={leaderboard}
        inventory={inventory}
        onCompleteMission={handleCompleteMission}
        onEquipItem={(itemId) => equipItem(student.id, itemId)}
        onUnequipItem={(itemId) => unequipItem(student.id, itemId)}
        onLogout={logout}
      />
    );
  }

  // Teacher Dashboard
  if (isTeacher) {
    const leaderboard = getLeaderboard();

    return (
      <TeacherDashboard
        teacher={user as { id: string; name: string; email: string; role: 'teacher'; avatar?: string; createdAt: Date; lastLogin: Date; classes: string[]; cloudProvider?: CloudProvider; cloudConfig?: { provider: CloudProvider; folderId?: string; accessToken?: string; refreshToken?: string; expiresAt?: Date } }}
        classes={classes}
        guilds={guilds}
        missions={missions}
        students={students}
        activityLogs={activityLogs}
        leaderboard={leaderboard}
        onCreateClass={handleCreateClass}
        onDeleteClass={deleteClass}
        onCreateGuild={handleCreateGuild}
        onAddStudent={handleAddStudent}
        onRemoveStudent={removeStudent}
        onResetPassword={resetStudentPassword}
        onCreateMission={handleCreateMission}
        onDeleteMission={deleteMission}
        onGivePunishment={(studentId, punishment) => givePunishment(studentId, { ...punishment, givenBy: user.id })}
        onGiveItem={(studentId, itemId) => giveItem(studentId, itemId)}
        onCloudConnect={handleCloudConnect}
        onCloudDisconnect={handleCloudDisconnect}
        onCreateBackup={handleCreateBackup}
        onExportData={handleExportData}
        onImportData={handleImportData}
        isCloudConnected={isCloudConnected}
        cloudProvider={cloudProvider}
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

export default App;
