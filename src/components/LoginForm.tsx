import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SteamPunkGear, SteamPunkDecoration } from './SteamPunkGear';
import type { UserRole } from '@/types';
import { Eye, EyeOff, User, GraduationCap, Lock, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string; role: UserRole }) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin({ email, password, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <SteamPunkDecoration />
      
      {/* Animated background gears */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <SteamPunkGear
          size={300}
          color="#B87333"
          speed={60}
          className="absolute -top-20 -left-20 opacity-5"
        />
        <SteamPunkGear
          size={250}
          color="#D4AF37"
          speed={45}
          reverse
          className="absolute -bottom-10 -right-10 opacity-5"
        />
        <SteamPunkGear
          size={180}
          color="#8B4513"
          speed={35}
          className="absolute top-1/4 -right-20 opacity-5"
        />
      </div>
      
      {/* Steam effect overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="steam-effect absolute bottom-0 left-1/4 w-32 h-64 bg-gradient-to-t from-[#F5F0E8]/5 to-transparent blur-3xl" />
        <div className="steam-effect absolute bottom-0 right-1/3 w-40 h-80 bg-gradient-to-t from-[#F5F0E8]/3 to-transparent blur-3xl" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Decorative gears on card */}
        <div className="absolute -top-8 -left-8">
          <SteamPunkGear size={60} color="#B87333" speed={20} />
        </div>
        <div className="absolute -bottom-6 -right-6">
          <SteamPunkGear size={50} color="#D4AF37" speed={15} reverse />
        </div>
        
        <div className="steampunk-card">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#B87333] to-[#8B4513] mb-4 border-4 border-[#D4AF37] shadow-lg"
            >
              <span className="text-4xl">🔬</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-gradient-gold mb-1">
              NatureQuest
            </h1>
            <p className="text-[#8B7355] text-sm">Aventuras em Ciências da Natureza</p>
          </div>
          
          {/* Role selector */}
          <div className="flex gap-2 mb-6 p-1 bg-[#1A1510]/50 rounded-lg">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ${
                role === 'student'
                  ? 'bg-[#B87333] text-[#F5F0E8] shadow-lg'
                  : 'text-[#8B7355] hover:text-[#C9B896]'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium">Aluno</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ${
                role === 'teacher'
                  ? 'bg-[#B87333] text-[#F5F0E8] shadow-lg'
                  : 'text-[#8B7355] hover:text-[#C9B896]'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Professor</span>
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label className="block text-sm text-[#C9B896] mb-2">
                {role === 'teacher' ? 'Email do Professor' : 'Email do Aluno'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="steampunk-input pl-10"
                  required
                />
              </div>
            </div>
            
            {/* Password input */}
            <div>
              <label className="block text-sm text-[#C9B896] mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="steampunk-input pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#C9B896]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#8B0000]/20 border border-[#8B0000] rounded-lg p-3 text-sm text-[#FF6B6B]"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <SteamPunkGear size={20} color="#F5F0E8" speed={1} />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
          
          {/* Demo credentials */}
          <div className="mt-6 pt-4 border-t border-[#B87333]/30">
            <p className="text-xs text-[#8B7355] text-center">
              Modo demonstração - qualquer email e senha funcionam
            </p>
          </div>
          
          {/* Footer decoration */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B87333]" />
            <SteamPunkGear size={24} color="#B87333" speed={15} />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B87333]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
