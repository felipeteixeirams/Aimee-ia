import { BaseRepository } from './BaseRepository';
import { GlobalConfig } from '../../types';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export class ConfigRepository extends BaseRepository<GlobalConfig> {
  constructor() {
    super('config');
  }

  async updateGlobal(updates: Partial<GlobalConfig>, updatedBy?: string): Promise<void> {
    const docRef = doc(db, 'config', 'global');
    await setDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: updatedBy || 'system'
    }, { merge: true });
  }
}

export const configRepository = new ConfigRepository();
