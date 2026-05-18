import { BaseRepository } from './BaseRepository.js';
import { ChatMessage } from '../../models/index.js';

export class ChatRepository extends BaseRepository<ChatMessage> {
  constructor() {
    super('users/{userId}/chatHistory');
  }
}

export const chatRepository = new ChatRepository();
