import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, ShieldCheck, Sparkles, AlertTriangle, Cpu, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { SystemHealth } from '../hooks/useAuth';

interface LoginProps {
  onLogin: () => void;
  onEmailLogin: (email: string, pass: string) => Promise<void>;
  onEmailRegister: (email: string, pass: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<boolean>;
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

export const Login: React.FC<LoginProps> = ({ 
  onLogin, 
  onEmailLogin, 
  onEmailRegister, 
  onResetPassword, 
  isLoading = false, 
  error = null, 
  health 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);

  const isSystemDown = !health.firebase || (!health.gemini && !health.deepseek);
  const isMaintenance = !health.firebase;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'login') {
      await onEmailLogin(email, password);
    } else {
      if (registerStep === 1) {
        if (email.includes('@') && email.includes('.')) {
          setRegisterStep(2);
        }
      } else {
        await onEmailRegister(email, password);
      }
    }
  };

  const handleResetPassword = async () => {
    if (!email) return;
    const ok = await onResetPassword(email);
    if (ok) setResetSent(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-black font-sans">
      <FireBackground />
      <div className="fixed top-0 left-0 right-0 z-50">
        <GamifiedLoadingBar active={isLoading} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-neutral-900/40 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
          
          <div className="flex p-2 bg-black/20 gap-1">
            <button
              onClick={() => { setActiveTab('login'); setRegisterStep(1); }}
              className={cn(
                "flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-[2rem] transition-all",
                activeTab === 'login' ? "bg-brand text-white shadow-lg" : "bg-white/5 text-neutral-500 hover:bg-white/10"
              )}
            >
              Login
            </button>
            <button
              onClick={() => { setActiveTab('register'); setRegisterStep(1); }}
              className={cn(
                "flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-[2rem] transition-all",
                activeTab === 'register' ? "bg-brand text-white shadow-lg" : "bg-white/5 text-neutral-500 hover:bg-white/10"
              )}
            >
              Registro
            </button>
          </div>

          <div className="p-10 pt-8 text-center">
            <motion.div className="w-20 h-20 bg-gradient-to-br from-brand to-orange-700 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(249,115,22,0.3)] relative">
              <UserIcon className="w-10 h-10 text-white" />
            </motion.div>

            <div className="mb-8">
              <h1 className="text-4xl font-black tracking-tighter text-white">
                AIMEE<span className="text-brand">.</span>
              </h1>
              <p className="text-neutral-500 text-[9px] font-bold uppercase tracking-[0.3em] mt-1">Neural Interface v4.0</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl"
                >
                  <p className="text-[10px] text-rose-400 font-black uppercase tracking-wider">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4 text-left mt-4">
              <div className="space-y-1.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 ml-4">E-mail</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${registerStep}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {(activeTab === 'login' || (activeTab === 'register' && registerStep === 2)) && (
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 ml-4">Senha</p>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                        placeholder="••••••••"
                        required={activeTab === 'login' || registerStep === 2}
                      />
                    </div>
                  )}

                  {activeTab === 'login' && (
                    <div className="flex justify-end px-2">
                      <button
                        type="button"
                        onClick={() => setShowReset(true)}
                        className="text-[10px] font-bold text-neutral-500 hover:text-brand transition-colors uppercase tracking-widest"
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-2 mt-4">
                {activeTab === 'register' && registerStep === 2 && (
                  <button
                    type="button"
                    onClick={() => setRegisterStep(1)}
                    className="flex-none px-6 py-5 bg-white/5 text-neutral-500 border border-white/10 rounded-3xl font-black uppercase tracking-widest text-xs"
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading || isMaintenance}
                  className={cn(
                    "flex-1 py-5 text-black rounded-3xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95",
                    (isLoading || isMaintenance) ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" : "bg-white hover:bg-neutral-200"
                  )}
                >
                  {activeTab === 'login' ? 'Acessar Interface' : (registerStep === 1 ? 'Prosseguir' : 'Criar Identidade')}
                </button>
              </div>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black"><span className="bg-transparent px-4 text-neutral-700">Ou continue com</span></div>
            </div>

            <button
              disabled={isLoading || isMaintenance}
              onClick={onLogin}
              className={cn(
                "w-full py-4 bg-white/5 border border-white/10 text-white rounded-3xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-4 hover:bg-white/10 active:scale-95",
                (isLoading || isMaintenance) && "opacity-50 cursor-not-allowed"
              )}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google Account
            </button>

            <AnimatePresence>
              {!health.firebase && (
                <div className="mt-4 flex items-center justify-center gap-2 text-rose-400 text-[10px] font-bold uppercase">
                  <Globe className="w-3 h-3" />
                  Conexão Offline
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 opacity-50">
          <div className="flex gap-2">
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3], backgroundColor: isMaintenance ? '#f43f5e' : '#f97316' }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 h-1 rounded-full"
              />
            ))}
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white">
            {isMaintenance ? "Maintenance" : "Active"}
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showReset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 backdrop-blur-2xl bg-black/60">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-neutral-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-sm text-center">
              <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">Recuperar Acesso</h2>
              {!resetSent ? (
                <>
                  <p className="text-xs text-neutral-500 mb-6 font-medium">Insira seu e-mail para recuperar a senha.</p>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white mb-6" placeholder="seu@email.com" />
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setShowReset(false)} className="py-4 bg-white/5 text-neutral-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Voltar</button>
                    <button onClick={handleResetPassword} className="py-4 bg-brand text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Enviar</button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto"><ShieldCheck className="w-8 h-8 text-green-500" /></div>
                  <p className="text-xs text-green-400 font-bold">Link enviado!</p>
                  <button onClick={() => { setShowReset(false); setResetSent(false); }} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest">OK</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
    </div>
  );
};
