import { BaseRepository } from './BaseRepository';
import { FamilyEvent } from '../../types';

export class EventRepository extends BaseRepository<FamilyEvent> {
  constructor() {
    super('users/{userId}/events');
  }
}

export const eventRepository = new EventRepository();
