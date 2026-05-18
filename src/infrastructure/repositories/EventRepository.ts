import { BaseRepository } from './BaseRepository.js';
import { FamilyEvent, FamilyEventSchema } from '../../models/index.js';

export class EventRepository extends BaseRepository<FamilyEvent> {
  constructor() {
    super('users/{userId}/events', FamilyEventSchema);
  }
}

export const eventRepository = new EventRepository();
