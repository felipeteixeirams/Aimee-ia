import { EventMonitorConfig, EventMonitorConfigSchema } from '../../models/index.js';
import { BaseRepository } from './BaseRepository.js';

export class EventMonitorConfigRepository extends BaseRepository<EventMonitorConfig> {
  constructor() {
    super('users/{userId}/monitor_config', EventMonitorConfigSchema);
  }

  async getConfig(userId: string): Promise<EventMonitorConfig | null> {
    const configs = await this.list([], userId);
    return configs.length > 0 ? configs[0] : null;
  }
}
