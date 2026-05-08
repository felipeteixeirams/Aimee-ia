import { BaseRepository } from './BaseRepository.js';
import { FamilyEvent } from '../../types/index.js';
import { FamilyEventSchema } from '../../domain/validation/schemas.js';

export class EventRepository extends BaseRepository<FamilyEvent> {
  constructor() {
    super('users/{userId}/events', FamilyEventSchema);
  }
}

export const eventRepository = new EventRepository();
