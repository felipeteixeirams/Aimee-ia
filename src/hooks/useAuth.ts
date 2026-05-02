import { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  User,
  testConnection
} from '../lib/firebase';
import { 
  doc, 
  onSnapshot 
} from 'firebase/firestore';
import { UserProfile, AIProvider } from '../types';
import { logger } from '../lib/logger';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { checkAIHealth } from '../services/aiService';

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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Health Check Effect
  useEffect(() => {
    async function performHealthCheck() {
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
      
      if (!newHealth.firebase || (!newHealth.gemini && !newHealth.deepseek)) {
        logger.warn('System Health Warning', newHealth);
      } else {
        logger.info('System Health OK', newHealth);
      }
    }

    performHealthCheck();
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
              
              if (data.theme) {
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

  return {
    user,
    profile,
    loading,
    isRegistering,
    setIsRegistering,
    isDarkMode,
    setIsDarkMode,
    setProfile,
    health
  };
}
