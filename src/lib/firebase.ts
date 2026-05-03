import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { logger } from './logger';
import { config } from './config';

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
  measurementId: config.firebase.measurementId,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, config.firebase.databaseId || undefined);
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
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return { ok: true };
    }
    logger.error('Firebase connection test failed', { error });
    return { ok: false, error: error.message };
  }
}

export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
export type { User };
