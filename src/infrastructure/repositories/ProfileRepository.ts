import { BaseRepository } from './BaseRepository.js';
import { UserProfile } from '../../types/index.js';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.js';
import { UserProfileSchema } from '../../models/index.js';

export class ProfileRepository extends BaseRepository<UserProfile & { id?: string }> {
  constructor() {
    super('users', UserProfileSchema);
  }

  async getProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  }

  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, updates);
  }

  async getGoogleCredentials(uid: string): Promise<any | null> {
    const docRef = doc(db, 'users', uid, 'private', 'credentials_google');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  }
}

export const profileRepository = new ProfileRepository();
