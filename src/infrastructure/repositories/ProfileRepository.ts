import { BaseRepository } from './BaseRepository.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.js';
import { UserProfile, UserProfileSchema } from '../../models/index.js';

export class ProfileRepository extends BaseRepository<UserProfile & { id?: string }> {
  constructor() {
    super('users', UserProfileSchema);
  }

  async getProfile(uid: string): Promise<UserProfile | null> {
    return this.getById(uid, uid);
  }

  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    return this.update(uid, updates, uid);
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
