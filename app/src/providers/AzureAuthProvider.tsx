import React, { createContext, useContext, ReactNode } from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { azureConfig } from '@/config/azure';

// Create MSAL instance
const msalInstance = new PublicClientApplication(azureConfig);

// Initialize MSAL
msalInstance.initialize().then(() => {
  // Handle redirect promise on load
  msalInstance.handleRedirectPromise().catch((error) => {
    console.error('MSAL redirect error:', error);
  });
}).catch((error) => {
  console.error('MSAL initialization error:', error);
});

interface AzureAuthContextType {
  msalInstance: PublicClientApplication;
}

const AzureAuthContext = createContext<AzureAuthContextType | null>(null);

export const useAzureAuthContext = () => {
  const context = useContext(AzureAuthContext);
  if (!context) {
    throw new Error('useAzureAuthContext must be used within AzureAuthProvider');
  }
  return context;
};

interface AzureAuthProviderProps {
  children: ReactNode;
}

export const AzureAuthProvider: React.FC<AzureAuthProviderProps> = ({ children }) => {
  return (
    <AzureAuthContext.Provider value={{ msalInstance }}>
      <MsalProvider instance={msalInstance}>
        {children}
      </MsalProvider>
    </AzureAuthContext.Provider>
  );
};

export { msalInstance };
