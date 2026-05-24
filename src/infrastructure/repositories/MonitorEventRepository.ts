import { MonitorEvent, MonitorEventSchema } from '../../models/index.js';
import { BaseRepository } from './BaseRepository.js';
import { db } from '../../lib/firebase.js';
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';

export class MonitorEventRepository extends BaseRepository<MonitorEvent> {
  constructor() {
    super('monitor_events', MonitorEventSchema);
  }

  async findRecentEvents(startDate: Date): Promise<MonitorEvent[]> {
    try {
      const q = query(
        collection(db, this.collectionPath),
        where('collectedAt', '>=', startDate.toISOString())
      );
      const snapshot = await getDocs(q);
        
      const results: MonitorEvent[] = [];
      snapshot.forEach(doc => {
        const item = { id: doc.id, ...doc.data() } as any;
        const parsed = this.schema.safeParse(item);
        if (parsed.success) {
          results.push(parsed.data as MonitorEvent);
        }
      });
      return results;
    } catch (error) {
      console.error(`Error finding recent events in ${this.collectionPath}:`, error);
      return [];
    }
  }

  async saveBatch(events: Omit<MonitorEvent, 'id'>[]): Promise<void> {
    const batch = writeBatch(db);
    events.forEach(event => {
      const docRef = doc(db, this.collectionPath, event.hash);
      const parsed = this.schema.parse({ ...event, id: event.hash });
      batch.set(docRef, parsed, { merge: true });
    });
    await batch.commit();
  }
}
