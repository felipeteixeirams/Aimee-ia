import { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  User,
  testConnection
} from '../../lib/firebase.js';
import { 
  doc, 
  onSnapshot 
} from 'firebase/firestore';
import { UserProfile, AIProvider } from '../../types/index.js';
import { logger } from '../../lib/logger.js';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils.js';
import { checkAIHealth } from '../services/aiService.js';
import { config } from '../../lib/config.js';

export interface SystemHealth {
  firebase: boolean;
  gemini: boolean;
  deepseek: boolean;
  isReady: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [health, setHealth] = useState<SystemHealth>({
    firebase: true,
    gemini: true,
    deepseek: true,
    isReady: false
  });
  const [criticalUnavailable, setCriticalUnavailable] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Health Check & Retry Engine
  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 5;
    let timeoutId: any;

    async function performHealthCheck() {
      try {
        const fbStatus = await testConnection();
        const geminiStatus = await checkAIHealth(AIProvider.GEMINI);
        const deepseekStatus = await checkAIHealth(AIProvider.DEEPSEEK);

        const newHealth = {
          firebase: fbStatus.ok,
          gemini: geminiStatus.ok,
          deepseek: deepseekStatus.ok,
          isReady: true
        };

        setHealth(newHealth);
        
        if (newHealth.firebase) {
          logger.info('✅ CONEXÃO FIREBASE ESTABELECIDA COM SUCESSO', { databaseId: config.firebase.databaseId });
          setCriticalUnavailable(false);
          retryCount = 0;
        } else {
          logger.warn('❌ Falha na conexão com Firebase (Database Offline)', { 
            error: fbStatus.error,
            databaseId: config.firebase.databaseId,
            attempt: retryCount + 1
          });
          
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            timeoutId = setTimeout(performHealthCheck, delay);
          } else {
            logger.error('System Health: Critical Failure (Database Offline)', { error: fbStatus.error });
            setCriticalUnavailable(true);
          }
        }
      } catch (err) {
        logger.error('Health check process failed unexpectedly', { error: err });
        timeoutId = setTimeout(performHealthCheck, 5000);
      }
    }

    performHealthCheck();

    const intervalId = setInterval(() => {
      performHealthCheck();
    }, 60000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      logger.info('Auth state changed', { isAuthenticated: !!u, userId: u?.uid });
      
      if (u) {
        try {
          // Force token refresh to verify valid session
          await u.getIdToken(true);
          setUser(u);
          testConnection();
          const userRef = doc(db, 'users', u.uid);
          
          const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
            if (!docSnap.exists()) {
              logger.info('New user detected, showing registration flow', { userId: u.uid });
              setIsRegistering(true);
              setProfile(null);
            } else {
              const data = docSnap.data() as UserProfile;
              logger.info('User profile updated', { userId: u.uid });
              setProfile(data);
              
              if (data.theme && data.theme !== (isDarkMode ? 'dark' : 'light')) {
                // Remove class directly before updating state to avoid flickers
                if (data.theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                setIsDarkMode(data.theme === 'dark');
              }
              setIsRegistering(false);
            }
            setLoading(false);
          }, (error) => {
            if (!error.message.includes('offline')) {
              handleFirestoreError(error, OperationType.GET, `users/${u.uid}`);
            }
            setLoading(false);
          });

          return () => unsubscribeProfile();
        } catch (err: any) {
          logger.error('Session invalid or token expired', { error: err.message });
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        setIsRegistering(false);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Effect to apply theme color from profile
  useEffect(() => {
    if (profile?.themeColor) {
      document.documentElement.setAttribute('data-color', profile.themeColor);
    } else {
      document.documentElement.removeAttribute('data-color');
    }
  }, [profile?.themeColor]);

  const [isRefreshingSession, setIsRefreshingSession] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState('');

  // Detecting app foreground/resume and running visual session renewal
  useEffect(() => {
    let lastActive = Date.now();
    localStorage.setItem('aimee_last_active', String(lastActive));

    const handleAppResume = async () => {
      const now = Date.now();
      const storedLastActive = Number(localStorage.getItem('aimee_last_active') || now);
      const timeElapsed = now - storedLastActive;
      
      // Update the active timestamp
      localStorage.setItem('aimee_last_active', String(now));
      lastActive = now;

      // If app was inactive in background/offline for more than 15 minutes (900.000 ms)
      const currentUser = auth.currentUser;
      if (currentUser && timeElapsed > 15 * 60 * 1000) {
        logger.info('📱 App retomado do segundo plano após período inativo. Iniciando renovação de sessão...', { timeElapsedMs: timeElapsed });
        
        setIsRefreshingSession(true);
        setRefreshProgress('Restaurando conexão...');
        
        try {
          await new Promise(resolve => setTimeout(resolve, 400));
          setRefreshProgress('Renovando suas credenciais...');
          
          // Força a renovação do ID Token no Firebase
          await currentUser.getIdToken(true);
          logger.info('🔑 ID Token do Firebase renovado com sucesso.');
          
          setRefreshProgress('Verificando integridade com o servidor...');
          await testConnection();
          
          setRefreshProgress('Sessão restaurada com sucesso!');
        } catch (error: any) {
          logger.warn('⚠️ Falha parcial ou total ao tentar renovar ID Token no resume.', { error: error.message });
        } finally {
          setTimeout(() => {
            setIsRefreshingSession(false);
            setRefreshProgress('');
          }, 800);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleAppResume();
      } else {
        localStorage.setItem('aimee_last_active', String(Date.now()));
      }
    };

    const handleFocus = () => {
      handleAppResume();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return {
    user,
    profile,
    loading,
    isRegistering,
    setIsRegistering,
    isDarkMode,
    setIsDarkMode,
    setProfile,
    health,
    criticalUnavailable,
    isRefreshingSession,
    refreshProgress
  };
}
