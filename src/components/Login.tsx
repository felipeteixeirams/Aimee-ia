import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, ShieldCheck, Sparkles, AlertTriangle, Cpu, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { SystemHealth } from '../hooks/useAuth';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: string | null;
  health: SystemHealth;
}

const Spark = ({ delay }: { delay: number }) => {
  const [randoms] = useState(() => ({
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    xOffset: Math.random() * 10 - 5
  }));
  
  return (
    <motion.div
      initial={{ y: '110vh', x: `${randoms.left}vw`, opacity: 0, scale: 0 }}
      animate={{ 
        y: '-10vh', 
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0.5],
        x: [`${randoms.left}vw`, `${randoms.left + randoms.xOffset}vw`]
      }}
      transition={{ 
        duration: randoms.duration, 
        repeat: Infinity, 
        delay,
        ease: "linear"
      }}
      className="absolute rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
      style={{ width: randoms.size, height: randoms.size }}
    />
  );
};

const FireBackground = () => {
  const [sparks] = useState(() => Array.from({ length: 40 }));
  
  return (
    <div className="fixed inset-0 bg-black overflow-hidden pointer-events-none">
      {/* Glow at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-orange-900/20 to-transparent" />
      
      {sparks.map((_, i) => (
        <Spark key={i} delay={i * 0.2} />
      ))}
    </div>
  );
};

const GamifiedLoadingBar = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full h-1.5 bg-black/50 backdrop-blur-md overflow-hidden relative"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-brand to-transparent w-1/2 z-10"
          />
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="h-full bg-brand/40 shadow-[0_0_15px_rgba(var(--brand-rgb),0.6)]"
          />
          {/* Scanning line */}
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            className="absolute top-0 bottom-0 right-0 w-px bg-white shadow-[0_0_8px_white]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading = false, error = null, health }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const isSystemDown = !health.firebase || (!health.gemini && !health.deepseek);
  const isMaintenance = !health.firebase;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-black font-sans">
      <FireBackground />
      
      {/* Top Loading Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GamifiedLoadingBar active={isLoading} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 max-w-md w-full"
      >
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-600/20 rounded-full blur-[100px] animate-pulse" />

        <div className="bg-neutral-900/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center relative overflow-hidden group">
          {/* Inner glow and scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          <motion.div
            initial={{ rotate: -15, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.3 
            }}
            className="w-28 h-28 bg-gradient-to-br from-brand to-orange-700 rounded-[2.8rem] flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(249,115,22,0.3)] relative group cursor-default"
          >
            <UserIcon className="w-14 h-14 text-white group-hover:scale-110 transition-transform duration-500" />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-[2.8rem] border border-white/30"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-brand animate-spin-slow" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <h1 className="text-5xl font-black tracking-tighter text-white">
              AIMEE<span className="text-brand">.</span>
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-white/10" />
              <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.3em]">Neural Interface v4.0</p>
              <div className="h-px w-8 bg-white/10" />
            </div>
            <p className="text-neutral-500 mt-6 text-sm leading-relaxed font-medium max-w-[240px] mx-auto">
              Sua central de inteligência pessoal orquestrada por IA.
            </p>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl"
                >
                  <p className="text-[10px] text-rose-400 font-black uppercase tracking-wider text-center">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <motion.button
              whileHover={!isMaintenance ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isMaintenance ? { scale: 0.98 } : {}}
              disabled={isLoading || isMaintenance}
              onClick={onLogin}
              className={cn(
                "w-full py-5 text-black rounded-3xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-4 shadow-[0_15px_30px_rgba(0,0,0,0.4)] group relative overflow-hidden",
                (isLoading || isMaintenance) ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" : "bg-white"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {!isMaintenance && (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}

              {isMaintenance && <AlertTriangle className="w-5 h-5 text-rose-500" />}

              <span className="relative z-10">
                {isMaintenance ? "Sistema em Manutenção" : "Entrar com Google"}
              </span>
              
              {isLoading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full"
                />
              )}
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {!health.firebase && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-rose-400 text-[10px] font-bold uppercase"
              >
                <Globe className="w-3 h-3" />
                Erro de Conexão com o Banco de Dados
              </motion.div>
            )}
            {(!health.gemini && !health.deepseek) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center justify-center gap-2 text-amber-400 text-[10px] font-bold uppercase"
              >
                <Cpu className="w-3 h-3" />
                Agentes de IA em Manutenção
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-10 flex items-center justify-center gap-3"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
              <ShieldCheck className="w-3 h-3 text-brand" />
              <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Encrypted</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-800" />
            <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-wider">Firebase Auth</span>
          </motion.div>
        </div>

        {/* Bottom indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 flex flex-col items-center gap-5"
        >
          <div className="flex gap-2">
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 1, 0.2],
                  backgroundColor: ['#404040', '#f97316', '#404040']
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
                className="w-1.5 h-1.5 rounded-full"
              />
            ))}
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] text-white font-black uppercase tracking-[0.4em] opacity-40">System Status</p>
            <p className={cn(
              "text-[9px] font-bold uppercase tracking-[0.2em]",
              isSystemDown ? "text-rose-500" : "text-brand"
            )}>
              {isMaintenance ? "Banco de Dados em Manutenção" : isSystemDown ? "Serviço Parcialmente Offline" : "All Modules Operational"}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Vignette effect */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
    </div>
  );
};

