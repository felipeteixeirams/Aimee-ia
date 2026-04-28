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
import { UserProfile } from '../types';
import { logger } from '../lib/logger';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      logger.info('Auth state changed', { isAuthenticated: !!u, userId: u?.uid });
      setUser(u);
      
      if (u) {
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
            
            // Apply theme preferences
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
      } else {
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
    setProfile
  };
}
