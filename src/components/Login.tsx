import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, History, Check, Loader2, X, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { SystemHealth } from '../hooks/useAuth.js';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../lib/firebase.js';

import { supportSchema } from '../models/index.js';

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
  "Sua assistente inteligente.",
  "Vamos imaginar...",
  "Vamos criar...",
  "Aimee"
];


const Spark = ({ delay }: { delay: number }) => {
  const [randoms] = useState(() => ({
    size: Math.random() * 8 + 4,
    left: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    xOffset: Math.random() * 30 - 15,
    glow: Math.random() * 20 + 10,
    delay: delay + Math.random() * 5,
    hue: Math.random() > 0.5 ? '#ffaa00' : '#ff5500',
    opacityMax: Math.random() * 0.5 + 0.3
  }));
  
  return (
    <motion.div
      initial={{ y: '110vh', x: `${randoms.left}vw`, opacity: 0, scale: 0 }}
      animate={{ 
        y: '-20vh', 
        opacity: [0, randoms.opacityMax, randoms.opacityMax, 0.1, 0],
        scale: [0.5, 1.2, 1, 0.8, 0],
        x: [`${randoms.left}vw`, `${randoms.left + randoms.xOffset}vw`]
      }}
      transition={{ 
        duration: randoms.duration, 
        repeat: Infinity, 
        delay: randoms.delay,
        ease: "linear"
      }}
      className="absolute rounded-full"
      style={{ 
        width: randoms.size, 
        height: randoms.size,
        background: randoms.hue,
        boxShadow: `0 0 ${randoms.glow}px ${randoms.hue}`,
        filter: 'blur(1px)'
      }}
    />
  );
};

const FireBackground = () => {
  const [sparks] = useState(() => Array.from({ length: 45 }));

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#050a14]">
      {/* Base deep glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(75,142,255,0.1)_0%,transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(233,179,255,0.05)_0%,transparent_50%)]"></div>
      
      {/* Embers animated */}
      {sparks.map((_, i) => (
        <Spark key={i} delay={i * 0.15} />
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] rounded-full" style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(233, 179, 255, 0.08), transparent 70%)'
        }}></div>
      </div>
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
        setTypingSpeed(60); 
        
        try {
          if (navigator.vibrate) {
            navigator.vibrate(10);
          }
        } catch (e) {
          // Ignore vibration failures/blocks
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
    <div className="relative flex flex-col items-center justify-center px-8 z-10 w-full">
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center mb-6 relative shadow-[0_0_40px_rgba(233,179,255,0.2)]" style={{
        background: 'rgba(27, 27, 27, 0.7)',
        backdropFilter: 'blur(30px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-secondary/40 to-transparent"></div>
        <svg className="w-16 h-16 text-secondary font-light z-10 relative" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
           <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
           <path d="m9 12 2 2 4-4"/>
        </svg>
      </div>

      <div className="min-h-[120px] md:min-h-[160px] flex items-center justify-center w-full">
        <h1 className="text-3xl md:text-5xl font-['Inter'] font-bold text-white tracking-tighter flex items-center justify-center drop-shadow-md text-center leading-tight">
          <span className="opacity-90">{displayText}</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-1 md:w-1.5 h-8 md:h-12 bg-secondary inline-block rounded-full ml-2"
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
  const [lastAuthProvider, setLastAuthProvider] = useState<string | null>(localStorage.getItem('aimee_auth_provider'));
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
      if (lastAuthProvider === 'google') {
        onLogin();
      } else {
        setEmail(lastUser);
        setIsNewUser(false);
        setStep('password');
      }
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
    <div className="fixed inset-0 bg-background text-on-surface font-sans overflow-hidden select-none flex flex-col justify-between items-center">
      <FireBackground />

      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-10" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <main className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-[1200px] px-5 pt-12 pb-[350px] md:pb-[400px] flex-grow">
        <TypingHero />
      </main>

      <div className="absolute inset-x-0 bottom-0 p-6 z-50 flex justify-center w-full">
        <AnimatePresence mode="wait">
          {isMaintenance ? (
            <motion.div
              key="maintenance"
              variants={menuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-neutral-900/60 backdrop-blur-3xl border border-rose-500/20 p-8 rounded-[1.5rem] w-full max-w-sm text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500/0 via-rose-500/40 to-rose-500/0" />
              
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-rose-500" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Sistema Indisponível</h2>
                <p className="text-sm text-neutral-400 font-medium leading-relaxed px-4">
                  Desculpe, o sistema está temporariamente offline.
                </p>
              </div>

              <div className="pt-4 space-y-3 flex flex-col items-center">
                <button
                  onClick={() => setShowSupport(true)}
                  className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-all mx-auto"
                >
                  Contatar Administrador
                </button>
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
              className="w-full max-w-sm flex flex-col items-center rounded-xl p-4 backdrop-blur-3xl relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
              style={{
                background: 'rgba(27, 27, 27, 0.7)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              {lastUser && (
                <button
                  onClick={handleContinueAsLastUser}
                  className="w-full bg-white/5 border border-white/5 text-white py-3 rounded-full font-bold flex items-center justify-between px-6 active:scale-[0.98] transition-all hover:bg-white/10 mb-3"
                >
                  <div className="text-left font-['Inter']">
                    <p className="text-[11px] text-neutral-400 font-medium">Continuar como</p>
                    <p className="text-sm truncate max-w-[200px] font-semibold">{lastUser}</p>
                  </div>
                  <History className="w-5 h-5 text-neutral-400" />
                </button>
              )}

              <button
                onClick={onLogin}
                className="w-full bg-primary-container text-on-primary-container font-semibold py-3 rounded-full flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_14px_rgba(75,142,255,0.3)] mb-3"
              >
                <span>Continuar com Google</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setStep('email')}
                className="w-full bg-transparent text-on-surface-variant font-medium py-3 rounded-full flex items-center justify-center hover:text-on-surface transition-colors active:scale-95"
              >
                Opções com Email
              </button>

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
              className="rounded-[1.5rem] p-8 w-full max-w-sm relative shadow-2xl backdrop-blur-3xl"
              style={{
                background: 'rgba(27, 27, 27, 0.8)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <button 
                onClick={() => setStep('options')}
                className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {step === 'email' ? 'Conta' : (isNewUser ? 'Criar Senha' : 'Entrar')}
                </h2>
                {step === 'password' && <p className="text-neutral-400 text-sm mt-1">{email}</p>}
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-error text-xs font-medium mt-3 bg-error-container/30 py-2 px-3 rounded-lg border border-error/20"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group w-full">
                  <input
                    autoFocus
                    type={step === 'email' ? 'email' : 'password'}
                    value={step === 'email' ? email : password}
                    onChange={(e) => step === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)}
                    placeholder={step === 'email' ? "Seu email" : (isNewUser ? "Mínimo 6 caracteres" : "Senha")}
                    className="w-full bg-[rgba(14,14,14,0.6)] border border-outline-variant/30 rounded-full py-3 pl-5 pr-12 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium placeholder:text-neutral-500 shadow-inner"
                  />
                  {step === 'email' && <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-primary transition-colors" />}
                  {step === 'password' && <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-primary transition-colors" />}
                </div>

                {step === 'password' && (
                  <div className="flex justify-between items-center px-4">
                    <button
                      type="button"
                      onClick={() => setShowReset(true)}
                      className="text-xs font-medium text-neutral-400 hover:text-white transition-colors"
                    >
                      Recuperar senha
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsNewUser(!isNewUser)}
                      className="text-xs font-bold text-primary hover:text-primary-fixed transition-colors"
                    >
                      {isNewUser ? 'Já tenho conta' : 'Criar conta'}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || isMaintenance || isCheckingEmail}
                  className="w-full bg-primary-container text-on-primary-container py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all hover:bg-primary-container/90 disabled:opacity-50 mx-auto mt-4"
                >
                  {(isLoading || isCheckingEmail) ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>{step === 'email' ? 'Avançar' : (isNewUser ? 'Registrar' : 'Acessar')}</span>
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
                      className="py-5 bg-brand text-brand-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-brand/20 active:scale-95 transition-all"
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
