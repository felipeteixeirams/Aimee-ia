import { BaseRepository } from './BaseRepository';
import { FamilyEvent } from '../../types';
import { FamilyEventSchema } from '../../domain/validation/schemas';

export class EventRepository extends BaseRepository<FamilyEvent> {
  constructor() {
    super('users/{userId}/events', FamilyEventSchema);
  }
}

export const eventRepository = new EventRepository();
