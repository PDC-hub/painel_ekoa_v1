import { useState, useEffect, useCallback } from 'react';
import { PublicClientApplication, EventType, AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { azureConfig, loginRequest, isInstitutionalEmail, AzureRole, mapAzureGroupsToRoles } from '@/config/azure';
import type { User, UserRole } from '@/types';

// MSAL Instance (singleton)
let msalInstance: PublicClientApplication | null = null;

const getMsalInstance = () => {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(azureConfig);
  }
  return msalInstance;
};

interface AzureAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  account: AccountInfo | null;
}

interface AzureUserData {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  groups: string[];
}

export function useAzureAuth() {
  const [state, setState] = useState<AzureAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    account: null,
  });

  const msal = getMsalInstance();

  // Initialize MSAL
  useEffect(() => {
    const initialize = async () => {
      try {
        await msal.initialize();
        
        // Handle redirect promise (after login)
        const response = await msal.handleRedirectPromise();
        
        if (response) {
          // Login successful
          const userData = await processAuthResponse(response);
          setState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            account: response.account,
          });
        } else {
          // Check for existing account
          const accounts = msal.getAllAccounts();
          if (accounts.length > 0) {
            const account = accounts[0];
            const userData = await getUserFromAccount(account);
            setState({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              account,
            });
          } else {
            setState(prev => ({ ...prev, isLoading: false }));
          }
        }
      } catch (error) {
        console.error('MSAL initialization error:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Erro ao inicializar autenticação',
        }));
      }
    };

    initialize();

    // Listen for login events
    const callbackId = msal.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        const result = event.payload as AuthenticationResult;
        processAuthResponse(result).then(userData => {
          setState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            account: result.account,
          });
        });
      } else if (event.eventType === EventType.LOGOUT_SUCCESS) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          account: null,
        });
      } else if (event.eventType === EventType.LOGIN_FAILURE) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Falha no login',
        }));
      }
    });

    return () => {
      if (callbackId) {
        msal.removeEventCallback(callbackId);
      }
    };
  }, []);

  // Process authentication response from Azure AD
  const processAuthResponse = async (response: AuthenticationResult): Promise<User> => {
    const account = response.account;
    return getUserFromAccount(account);
  };

  // Extract user data from Azure AD account
  const getUserFromAccount = async (account: AccountInfo): Promise<User> => {
    const email = account.username || account.idTokenClaims?.email as string || '';
    const name = account.name || account.idTokenClaims?.name as string || '';
    
    // Get groups from token claims
    const groups = (account.idTokenClaims?.groups as string[]) || [];
    
    // Map Azure AD groups to application roles
    const role = mapAzureGroupsToRoles(groups);
    
    // Generate avatar from name initials
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return {
      id: account.localAccountId,
      email,
      name,
      role,
      avatar: initials,
      createdAt: new Date(),
      lastLogin: new Date(),
    };
  };

  // Login with Microsoft 365
  const login = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await msal.loginRedirect({
        ...loginRequest,
        prompt: 'select_account',
      });
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao iniciar login',
      }));
    }
  }, []);

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      await msal.logoutRedirect({
        postLogoutRedirectUri: azureConfig.auth.postLogoutRedirectUri,
      });
    } catch (error) {
      console.error('Logout error:', error);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Erro ao fazer logout',
        account: null,
      });
    }
  }, []);

  // Get access token for API calls
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const account = state.account || msal.getAllAccounts()[0];
    if (!account) return null;

    try {
      const response = await msal.acquireTokenSilent({
        ...loginRequest,
        account,
      });
      return response.accessToken;
    } catch (error) {
      // Silent token acquisition failed, try interactive
      try {
        const response = await msal.acquireTokenPopup({
          ...loginRequest,
          account,
        });
        return response.accessToken;
      } catch (popupError) {
        console.error('Token acquisition error:', popupError);
        return null;
      }
    }
  }, [state.account]);

  // Check if user has specific role
  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  // Check if email is from allowed domain
  const validateInstitutionalEmail = useCallback((): boolean => {
    if (!state.user?.email) return false;
    return isInstitutionalEmail(state.user.email);
  }, [state.user]);

  return {
    ...state,
    login,
    logout,
    getAccessToken,
    hasRole,
    validateInstitutionalEmail,
    isTeacher: state.user?.role === 'teacher',
    isStudent: state.user?.role === 'student',
    msalInstance: msal,
  };
}

// Hook for protecting routes
export function useRequireAuth(requiredRole?: UserRole) {
  const auth = useAzureAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      auth.login();
    }
    
    if (requiredRole && auth.isAuthenticated && auth.user?.role !== requiredRole) {
      // Redirect to unauthorized page or home
      console.warn('User does not have required role:', requiredRole);
    }
  }, [auth, requiredRole]);

  return auth;
}
