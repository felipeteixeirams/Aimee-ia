import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  ArrowRight, 
  Mail, 
  Lock, 
  X,
  History,
  Check,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SystemHealth } from '../hooks/useAuth';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

import { supportSchema } from '../types/schemas';

interface LoginProps {
  onLogin: () => void;
  onEmailLogin: (email: string, pass: string) => Promise<void>;
  onEmailRegister: (email: string, pass: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<boolean>;
  isLoading?: boolean;
  error?: string | null;
  health: SystemHealth;
  criticalUnavailable: boolean;
}

const PHRASES = [
  "Vamos imaginar...",
  "Vamos explorar...",
  "Vamos criar...",
  "AIMEE",
  "Sua assistente inteligente."
];

const Spark = ({ delay }: { delay: number }) => {
  const [randoms] = useState(() => ({
    size: Math.random() * 2 + 1,
    left: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    xOffset: Math.random() * 30 - 15,
    glow: Math.random() * 15 + 10,
    delay: delay + Math.random() * 2
  }));
  
  return (
    <motion.div
      initial={{ y: '110vh', x: `${randoms.left}vw`, opacity: 0, scale: 0 }}
      animate={{ 
        y: '-20vh', 
        opacity: [0, 1, 1, 0.4, 0],
        scale: [0.5, 1.2, 1, 0.5, 0],
        x: [`${randoms.left}vw`, `${randoms.left + randoms.xOffset}vw`]
      }}
      transition={{ 
        duration: randoms.duration, 
        repeat: Infinity, 
        delay: randoms.delay,
        ease: "easeOut"
      }}
      className="absolute rounded-full"
      style={{ 
        width: randoms.size, 
        height: randoms.size,
        background: 'linear-gradient(to bottom, #ff9d00, #ff4c00)',
        boxShadow: `0 0 ${randoms.glow}px #ff4c00, 0 0 ${randoms.glow/2}px #fff`
      }}
    />
  );
};

const FireBackground = () => {
  const [sparks] = useState(() => Array.from({ length: 60 }));
  
  return (
    <div className="fixed inset-0 bg-black overflow-hidden pointer-events-none z-0">
      {/* Base glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[80vh] bg-[radial-gradient(ellipse_at_50%_100%,rgba(120,40,0,0.25),transparent_70%)]" />
      
      {/* Fire core glow */}
      <div className="absolute bottom-[-10vh] left-[20%] right-[20%] h-[40vh] bg-orange-900/20 blur-[100px] rounded-full" />
      
      {sparks.map((_, i) => (
        <Spark key={i} delay={i * 0.1} />
      ))}
      
      {/* Smoke effect (subtle) */}
      <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-[1px]" />
    </div>
  );
};

const TypingHero = () => {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const phrase = PHRASES[phraseIndex];
    
    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayText(phrase.substring(0, displayText.length + 1));
        setTypingSpeed(60); // Mais rápido (era 100)
        
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }

        if (displayText === phrase) {
          setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        setDisplayText(phrase.substring(0, displayText.length - 1));
        setTypingSpeed(30); // Deleção bem mais rápida (era 60)

        if (displayText === '') {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex, typingSpeed]);

  return (
    <div className="relative flex items-center justify-center h-[50vh] px-8 z-10">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter flex items-center justify-center gap-3 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] font-sans">
          {displayText}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-1.5 h-8 md:w-2 md:h-12 bg-white inline-block rounded-full shadow-[0_0_15px_white]"
          />
        </h1>
      </div>
    </div>
  );
};

export const Login: React.FC<LoginProps> = ({ 
  onLogin, 
  onEmailLogin, 
  onEmailRegister, 
  onResetPassword, 
  isLoading = false, 
  error = null, 
  health,
  criticalUnavailable
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'options' | 'email' | 'password'>('options');
  const [rememberMe, setRememberMe] = useState(true);
  const [lastUser, setLastUser] = useState<string | null>(localStorage.getItem('aimee_last_email'));
  const [isNewUser, setIsNewUser] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Support Flow State
  const [showSupport, setShowSupport] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportSent, setSupportSent] = useState(false);

  const isMaintenance = !health.firebase || criticalUnavailable;

  const handleSendSupport = async () => {
    const payload = { email: email || 'usuario@aimee.link', message: supportMessage };
    
    // Validação frontend antecipada
    const validation = supportSchema.safeParse(payload);
    if (!validation.success) {
      alert(validation.error.issues[0].message);
      return;
    }

    setIsSendingSupport(true);
    try {
      const response = await fetch('/api/support/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) setSupportSent(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingSupport(false);
    }
  };

  useEffect(() => {
    if (rememberMe && email) {
      localStorage.setItem('aimee_last_email', email);
    }
  }, [email, rememberMe]);

  const handleContinueAsLastUser = () => {
    if (lastUser) {
      setEmail(lastUser);
      setIsNewUser(false);
      setStep('password');
    }
  };

  const handleEmailContinue = async () => {
    if (!email.includes('@')) return;
    setIsCheckingEmail(true);
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      setIsNewUser(methods.length === 0);
      setStep('password');
    } catch (e) {
      // Se houver erro ou proteção contra enumeração, permitimos prosseguir e o botão de ação dirá "Acessar"
      setIsNewUser(false);
      setStep('password');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'email') {
      handleEmailContinue();
    } else if (step === 'password') {
      if (isNewUser) {
        await onEmailRegister(email, password);
      } else {
        await onEmailLogin(email, password);
      }
    }
  };

  const menuVariants = {
    initial: { y: '50%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '20%', opacity: 0 }
  };

  return (
    <div className="fixed inset-0 bg-black font-sans overflow-hidden select-none">
      <FireBackground />
      
      {/* Subtle Grain Overlay for cinematic feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-10" />

      {/* Hero Section */}
      <TypingHero />

      {/* Bottom Interface */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-50">
        <AnimatePresence mode="wait">
          {isMaintenance ? (
            <motion.div
              key="maintenance"
              variants={menuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-neutral-900/60 backdrop-blur-3xl border border-rose-500/20 p-8 rounded-[3rem] text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500/0 via-rose-500/40 to-rose-500/0" />
              
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-rose-500" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Sistema Indisponível</h2>
                <p className="text-xs text-neutral-400 font-medium leading-relaxed px-4">
                  Desculpe, o sistema está temporariamente offline para manutenção ou devido a instabilidades de conexão.
                </p>
              </div>

              <div className="pt-4 space-y-3 flex flex-col items-center">
                <button
                  onClick={() => setShowSupport(true)}
                  className="w-full max-w-[280px] bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-white/5 active:scale-95 transition-all mx-auto"
                >
                  Contatar Administrador
                </button>
                <p className="text-[10px] text-neutral-600 font-black uppercase tracking-widest text-center">Aimee Core v3.0</p>
              </div>
            </motion.div>
          ) : step === 'options' && (
            <motion.div
              key="options"
              variants={menuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="space-y-3 pb-12 flex flex-col items-center"
            >
              {lastUser && (
                <button
                  onClick={handleContinueAsLastUser}
                  className="w-full max-w-[320px] bg-white text-black py-5 rounded-2xl font-bold flex items-center justify-between px-6 active:scale-[0.98] transition-all shadow-xl mx-auto"
                >
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest opacity-60 font-black">Continuar como</p>
                    <p className="text-sm truncate max-w-[200px] font-black">{lastUser}</p>
                  </div>
                  <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                    <History className="w-5 h-5 opacity-40" />
                  </div>
                </button>
              )}

              <button
                onClick={onLogin}
                className="w-full max-w-[320px] bg-neutral-900/60 backdrop-blur-3xl border border-white/10 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-all mx-auto"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="tracking-tight font-black">Continuar com Google</span>
              </button>

              <button
                onClick={() => setStep('email')}
                className="w-full max-w-[320px] bg-neutral-900/60 backdrop-blur-3xl border border-white/10 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-all mx-auto"
              >
                <Mail className="w-5 h-5 opacity-60" />
                <span className="tracking-tight font-black">Continuar com E-mail</span>
              </button>

              <div className="flex items-center justify-center gap-2 pt-6">
                <button 
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-black group"
                >
                  <div className={cn(
                    "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                    rememberMe ? "bg-white border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]" : "border-white/40 group-hover:border-white/70"
                  )}>
                    {rememberMe && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                  </div>
                  <span className={cn(
                    "transition-colors duration-300 drop-shadow-sm",
                    rememberMe ? "text-white" : "text-neutral-400 group-hover:text-white"
                  )}>Lembrar de mim</span>
                </button>
              </div>
            </motion.div>
          )}

          {(step === 'email' || step === 'password') && (
            <motion.div
              key="form"
              variants={menuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-neutral-900 rounded-[3rem] p-8 border border-white/5 relative shadow-2xl"
            >
              <button 
                onClick={() => setStep('options')}
                className="absolute top-8 right-8 p-3 bg-white/5 rounded-full text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-black text-white tracking-tighter">
                  {step === 'email' ? 'E-mail' : 'Senha'}
                </h2>
                {step === 'password' && <p className="text-neutral-500 text-xs mt-2 font-medium truncate opacity-60">{email}</p>}
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-3 bg-rose-500/10 py-2 px-4 rounded-xl border border-rose-500/20"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative group">
                  <input
                    autoFocus
                    type={step === 'email' ? 'email' : 'password'}
                    value={step === 'email' ? email : password}
                    onChange={(e) => step === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)}
                    placeholder={step === 'email' ? "Seu melhor e-mail" : "Sua senha segura"}
                    className="w-full max-w-[320px] bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all font-bold placeholder:text-neutral-700 mx-auto block"
                  />
                  {step === 'email' && <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-700 group-focus-within:text-brand transition-colors" />}
                  {step === 'password' && <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-700 group-focus-within:text-brand transition-colors" />}
                </div>

                {step === 'password' && (
                  <div className="flex justify-between items-center px-2">
                    <button
                      type="button"
                      onClick={() => setShowReset(true)}
                      className="text-[10px] uppercase tracking-widest font-black text-neutral-600 hover:text-white transition-colors"
                    >
                      Esqueci a senha
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsNewUser(!isNewUser)}
                      className="text-[10px] uppercase tracking-widest font-black text-brand hover:brightness-125 transition-all"
                    >
                      {isNewUser ? 'Já tenho conta' : 'Criar conta'}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || isMaintenance || isCheckingEmail}
                  className="w-full max-w-[280px] bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-xs flex items-center justify-center gap-3 shadow-2xl active:scale-[0.97] transition-all hover:bg-neutral-100 disabled:opacity-50 mx-auto"
                >
                  {(isLoading || isCheckingEmail) ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <span>{step === 'email' ? 'Continuar' : (isNewUser ? 'Registrar' : 'Acessar')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* System Status Indicators */}
      <div className="fixed top-8 right-8 flex items-center gap-3 z-50">
        <AnimatePresence>
          {!health.firebase && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-xl text-rose-500 px-4 py-2 rounded-full border border-rose-500/30 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl"
            >
              <Globe className="w-3.5 h-3.5 animate-pulse" />
              Offline
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Esqueci Senha */}
      <AnimatePresence>
        {showReset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 backdrop-blur-2xl bg-black/60">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="bg-neutral-900 border border-white/10 p-10 rounded-[3.5rem] w-full max-w-sm text-center shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              <h2 className="text-2xl font-black text-white mb-4 tracking-tighter">RECUPERAR</h2>
              {!resetSent ? (
                <>
                  <p className="text-[10px] text-neutral-500 mb-8 font-black uppercase tracking-widest leading-loose">Enviaremos um link de acesso para seu e-mail.</p>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white mb-6 focus:outline-none focus:ring-2 focus:ring-brand/50 font-bold" placeholder="seu@email.com" />
                  <div className="grid grid-cols-2 gap-4 max-w-[320px] mx-auto">
                    <button onClick={() => setShowReset(false)} className="py-5 bg-white/5 text-neutral-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-colors">Voltar</button>
                    <button 
                      onClick={async () => {
                        const ok = await onResetPassword(email);
                        if (ok) setResetSent(true);
                      }} 
                      className="py-5 bg-brand text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-brand/20 active:scale-95 transition-all"
                    >
                      Enviar
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-8 py-4 text-center">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-white font-black uppercase tracking-tight">E-mail Enviado</p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Verifique sua caixa de entrada.</p>
                  </div>
                  <button onClick={() => { setShowReset(false); setResetSent(false); }} className="w-full py-5 bg-white text-black rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95">Ok, entendi</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* Modal Suporte/Indisponibilidade */}
      <AnimatePresence>
        {showSupport && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6 backdrop-blur-2xl bg-black/80">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="bg-neutral-950 border border-white/10 p-8 rounded-[3rem] w-full max-w-sm relative shadow-2xl"
            >
              <button 
                onClick={() => { setShowSupport(false); setSupportSent(false); }}
                className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-black text-white mb-2 tracking-tighter uppercase">Suporte Direto</h2>
              
              {!supportSent ? (
                <div className="space-y-6">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                    Sua mensagem será enviada diretamente ao administrador principal. Max 100 caracteres.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        autoFocus
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value.substring(0, 100))}
                        placeholder="O que está acontecendo?"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 font-bold resize-none h-32"
                      />
                      <div className="absolute bottom-4 right-4 text-[10px] font-black text-neutral-700">
                        {supportMessage.length}/100
                      </div>
                    </div>

                    <button 
                      onClick={handleSendSupport}
                      disabled={isSendingSupport || !supportMessage.trim()}
                      className="w-full max-w-[280px] py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                    >
                      {isSendingSupport ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Mail className="w-3 h-3" />
                          <span>Enviar Agora</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-white font-black uppercase tracking-tight">Enviado com Sucesso</p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                      O administrador foi notificado. Responderemos via e-mail o mais rápido possível.
                    </p>
                  </div>
                  <button 
                    onClick={() => { setShowSupport(false); setSupportSent(false); setSupportMessage(''); }}
                    className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95"
                  >
                    Entendi
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Screen Edge Shadow for depth */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.9)] z-50" />
    </div>
  );
};
