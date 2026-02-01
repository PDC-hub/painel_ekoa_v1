/**
 * Azure AD / Microsoft 365 Configuration
 * 
 * Para configurar:
 * 1. Acesse: https://portal.azure.com
 * 2. Azure Active Directory → App registrations → New registration
 * 3. Configure as URLs de redirecionamento
 * 4. Copie o Client ID e Tenant ID para cá
 */

// Configuração do Azure AD
export const azureConfig = {
  auth: {
    // Substitua pelo seu Client ID do Azure AD
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'SEU_CLIENT_ID_AQUI',
    
    // Authority: URL do seu tenant Microsoft 365 Education
    // Formato: https://login.microsoftonline.com/{tenant-id}
    authority: import.meta.env.VITE_AZURE_AUTHORITY || 'https://login.microsoftonline.com/common',
    
    // URL de redirecionamento após login
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
    
    // URL após logout
    postLogoutRedirectUri: import.meta.env.VITE_AZURE_POST_LOGOUT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage' as const,
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: number, message: string, containsPii: boolean) => {
        if (containsPii) return;
        console.log(`[MSAL] ${message}`);
      },
      piiLoggingEnabled: false,
      logLevel: import.meta.env.DEV ? 3 : 0, // Verbose in dev, Error in prod
    },
  },
};

// Scopes necessários para a aplicação
export const loginRequest = {
  scopes: [
    'openid',
    'profile',
    'User.Read',
    'email',
  ],
};

// Configuração de domínios permitidos (whitelist)
export const allowedDomains = [
  '@portalsesisp.org.br',
  // Adicione outros domínios da instituição aqui
];

// Verifica se o email é da instituição
export const isInstitutionalEmail = (email: string): boolean => {
  return allowedDomains.some(domain => email.toLowerCase().endsWith(domain.toLowerCase()));
};

// Roles/Perfis na aplicação
export type AzureRole = 'teacher' | 'student' | 'admin';

// Mapeia grupos do Azure AD para roles da aplicação
export const mapAzureGroupsToRoles = (groups: string[]): AzureRole => {
  // Configure os Object IDs dos grupos no Azure AD
  const teacherGroups = import.meta.env.VITE_AZURE_TEACHER_GROUPS?.split(',') || [];
  const adminGroups = import.meta.env.VITE_AZURE_ADMIN_GROUPS?.split(',') || [];
  
  if (groups.some(g => adminGroups.includes(g))) return 'admin';
  if (groups.some(g => teacherGroups.includes(g))) return 'teacher';
  return 'student';
};

// Configuração do Azure SQL Database
export const azureSQLConfig = {
  server: import.meta.env.VITE_AZURE_SQL_SERVER || 'seu-servidor.database.windows.net',
  database: import.meta.env.VITE_AZURE_SQL_DATABASE || 'NatureQuestDB',
  authentication: {
    type: 'azure-active-directory-default',
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

// Configuração do Azure Blob Storage (para arquivos)
export const azureStorageConfig = {
  accountName: import.meta.env.VITE_AZURE_STORAGE_ACCOUNT || 'seustorage',
  containerName: import.meta.env.VITE_AZURE_STORAGE_CONTAINER || 'naturequest-files',
};

// URLs da API Azure Functions
export const apiEndpoints = {
  base: import.meta.env.VITE_API_BASE_URL || '/api',
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
  classes: {
    list: '/classes',
    create: '/classes',
    delete: (id: string) => `/classes/${id}`,
    students: (id: string) => `/classes/${id}/students`,
  },
  students: {
    list: '/students',
    create: '/students',
    update: (id: string) => `/students/${id}`,
    delete: (id: string) => `/students/${id}`,
    resetPassword: (id: string) => `/students/${id}/reset-password`,
  },
  missions: {
    list: '/missions',
    create: '/missions',
    update: (id: string) => `/missions/${id}`,
    delete: (id: string) => `/missions/${id}`,
    complete: (id: string) => `/missions/${id}/complete`,
  },
  guilds: {
    list: '/guilds',
    create: '/guilds',
    update: (id: string) => `/guilds/${id}`,
    delete: (id: string) => `/guilds/${id}`,
    addMember: (id: string) => `/guilds/${id}/members`,
  },
  items: {
    list: '/items',
    give: '/items/give',
    equip: '/items/equip',
  },
  leaderboard: '/leaderboard',
  activity: '/activity',
};

// Ambiente de desenvolvimento vs produção
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Feature flags
export const features = {
  useAzureAuth: import.meta.env.VITE_USE_AZURE_AUTH === 'true' || false,
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || true,
  enableCloudBackup: import.meta.env.VITE_ENABLE_CLOUD_BACKUP === 'true' || false,
};
