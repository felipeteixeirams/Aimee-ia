import { UserProfile } from '../types/index.js';

class NotificationService {
  private hasPermission: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.hasPermission = Notification.permission === 'granted';
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações desktop');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    }

    return false;
  }

  notify(title: string, options?: NotificationOptions) {
    if (!this.hasPermission) return;

    // Standard notification to leak outside the app
    const notification = new Notification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      silent: false,
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  // Helper to check if we can actually use notifications
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  getPermissionStatus(): NotificationPermission {
    return typeof window !== 'undefined' ? Notification.permission : 'default';
  }
}

export const notificationService = new NotificationService();
