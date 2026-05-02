import { BaseRepository } from './BaseRepository';
import { UserProfile } from '../../types';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class ProfileRepository extends BaseRepository<UserProfile & { id?: string }> {
  constructor() {
    super('users');
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
}

export const profileRepository = new ProfileRepository();
