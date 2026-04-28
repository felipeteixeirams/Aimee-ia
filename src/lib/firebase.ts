import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { logger } from './logger';
import localConfig from '../../firebase-applet-config.json';

// Use environment variables if available (Vercel/Vite), otherwise fallback to local config
const getCfg = (key: string, envKey: string) => {
  const envVal = import.meta.env[envKey];
  return (envVal && envVal.trim() !== "") ? envVal : (localConfig as any)[key];
};

const firebaseConfig = {
  apiKey: getCfg('apiKey', 'VITE_FIREBASE_API_KEY'),
  authDomain: getCfg('authDomain', 'VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getCfg('projectId', 'VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getCfg('storageBucket', 'VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getCfg('messagingSenderId', 'VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getCfg('appId', 'VITE_FIREBASE_APP_ID'),
  measurementId: getCfg('measurementId', 'VITE_FIREBASE_MEASUREMENT_ID'),
  firestoreDatabaseId: getCfg('firestoreDatabaseId', 'VITE_FIREBASE_DATABASE_ID')
};

// Validate critical config
const missingVars = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value && key !== 'measurementId' && key !== 'firestoreDatabaseId') 
  .map(([key]) => key);

if (missingVars.length > 0) {
  logger.error('Missing Firebase configuration variables', { missingVars });
} else {
  logger.info('Firebase initialized', { 
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  });
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

// Initialize Analytics
isSupported().then(yes => yes && getAnalytics(app));

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
googleProvider.setCustomParameters({
  prompt: 'consent'
});

// Test connection
export async function testConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    logger.info('Firebase connection verified');
    return { ok: true };
  } catch (error: any) {
    // Silently handle offline errors for the connection test
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return { ok: true }; // Consider ok if just offline
    }
    logger.error('Firebase connection test failed', { error });
    return { ok: false, error: error.message };
  }
}

export { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider };
export type { User };
