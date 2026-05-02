import { BaseRepository } from './BaseRepository';
import { ChatMessage } from '../../types';

export class ChatRepository extends BaseRepository<ChatMessage> {
  constructor() {
    super('users/{userId}/chatHistory');
  }
}

export const chatRepository = new ChatRepository();
