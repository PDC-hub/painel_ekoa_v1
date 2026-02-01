import React from 'react';
import { motion } from 'framer-motion';
import { useAzureAuth } from '@/hooks/useAzureAuth';
import { SteamPunkGear } from './SteamPunkGear';
import { allowedDomains } from '@/config/azure';

interface AzureLoginButtonProps {
  onLogin?: () => void;
}

export const AzureLoginButton: React.FC<AzureLoginButtonProps> = ({ onLogin }) => {
  const { login, isLoading, error } = useAzureAuth();

  const handleLogin = async () => {
    await login();
    onLogin?.();
  };

  return (
    <div className="w-full max-w-md">
      {/* Microsoft Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#00A4EF] via-[#0078D4] to-[#005A9E] mb-4 border-4 border-[#D4AF37] shadow-lg">
          <svg className="w-10 h-10 text-white" viewBox="0 0 21 21" fill="currentColor">
            <rect x="1" y="1" width="9" height="9" />
            <rect x="11" y="1" width="9" height="9" />
            <rect x="1" y="11" width="9" height="9" />
            <rect x="11" y="11" width="9" height="9" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gradient-gold mb-2">
          NatureQuest
        </h1>
        <p className="text-[#8B7355] text-sm">
          Plataforma Gamificada de Ciências
        </p>
      </motion.div>

      {/* Login Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <SteamPunkGear size={24} color="#F5F0E8" speed={1} />
            <span>Conectando...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 21 21" fill="currentColor">
              <rect x="1" y="1" width="9" height="9" />
              <rect x="11" y="1" width="9" height="9" />
              <rect x="1" y="11" width="9" height="9" />
              <rect x="11" y="11" width="9" height="9" />
            </svg>
            <span>Entrar com Microsoft 365</span>
          </>
        )}
      </motion.button>

      {/* Domínios permitidos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-center"
      >
        <p className="text-xs text-[#8B7355] mb-2">Domínios permitidos:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {allowedDomains.map((domain) => (
            <span
              key={domain}
              className="text-xs px-2 py-1 bg-[#2D2418] rounded text-[#C9B896]"
            >
              {domain}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 bg-[#8B0000]/20 border border-[#8B0000] rounded-lg p-3 text-sm text-[#FF6B6B]"
        >
          {error}
        </motion.div>
      )}

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 pt-4 border-t border-[#B87333]/30 text-center"
      >
        <p className="text-xs text-[#8B7355]">
          Use sua conta Microsoft 365 Education
        </p>
      </motion.div>
    </div>
  );
};

// Componente para mostrar usuário logado
export const AzureUserInfo: React.FC = () => {
  const { user, logout, isLoading } = useAzureAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0078D4] to-[#005A9E] flex items-center justify-center text-white font-bold text-sm">
          {user.avatar}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-[#F5F0E8]">{user.name}</p>
          <p className="text-xs text-[#8B7355]">{user.email}</p>
        </div>
      </div>
      <button
        onClick={logout}
        disabled={isLoading}
        className="p-2 rounded-lg hover:bg-[#8B0000]/20 text-[#8B7355] hover:text-[#8B0000] transition-colors"
        title="Sair"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  );
};
