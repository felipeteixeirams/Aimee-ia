import { MonitorEvent, MonitorEventSchema } from '../../models/index.js';
import { BaseRepository } from './BaseRepository.js';
import { db } from '../../lib/firebase.js';

export class MonitorEventRepository extends BaseRepository<MonitorEvent> {
  constructor() {
    super('monitor_events', MonitorEventSchema);
  }

  async findRecentEvents(startDate: Date): Promise<MonitorEvent[]> {
    try {
      const snapshot = await db.collection(this.collectionPath)
        .where('collectedAt', '>=', startDate.toISOString())
        .get();
        
      const results: MonitorEvent[] = [];
      snapshot.forEach(doc => {
        const item = { id: doc.id, ...doc.data() } as any;
        const parsed = this.schema.safeParse(item);
        if (parsed.success) {
          results.push(parsed.data);
        }
      });
      return results;
    } catch (error) {
      console.error(`Error finding recent events in ${this.collectionPath}:`, error);
      return [];
    }
  }

  async saveBatch(events: Omit<MonitorEvent, 'id'>[]): Promise<void> {
    const batch = db.batch();
    events.forEach(event => {
      const docRef = db.collection(this.collectionPath).doc(event.hash);
      const parsed = this.schema.parse({ ...event, id: event.hash });
      batch.set(docRef, parsed, { merge: true });
    });
    await batch.commit();
  }
}
