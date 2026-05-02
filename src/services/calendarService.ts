import { FamilyEvent } from "../types";
import { config } from '../lib/config';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { logger } from '../lib/logger';

export const calendarService = {
  async fetchGoogleCalendarEvents(accessToken: string): Promise<Omit<FamilyEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]> {
    try {
      const now = new Date().toISOString();
      const apiKey = config.firebase.apiKey;
      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=10&singleEvents=true&orderBy=startTime&key=${apiKey}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let parsedError;
        try {
          parsedError = JSON.parse(errorBody);
        } catch (e) {
          parsedError = { error: { message: errorBody } };
        }
        
        const serverMsg = parsedError.error?.message || errorBody;
        logger.error('Google Calendar API Error', { status: response.status, serverMsg, details: parsedError });
        
        throw new Error(`Erro do Google Calendar (${response.status}): ${serverMsg}`);
      }

      const data = await response.json();
      return (data.items || []).map((item: any) => ({
        title: item.summary || 'Evento sem título',
        description: item.description || '',
        date: item.start.dateTime || item.start.date,
        type: 'appointment' as const,
        googleEventId: item.id
      }));
    } catch (error: any) {
      logger.error('Calendar Service Fetch Error', { error: error.message });
      throw error;
    }
  },

  async saveGoogleCredentials(userId: string, tokens: any) {
    try {
      const credRef = doc(db, 'users', userId, 'private', 'credentials_google');
      await setDoc(credRef, {
        ...tokens,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      logger.info('CalendarService: Saved Google credentials', { userId });
      return true;
    } catch (error: any) {
      logger.error('CalendarService: Error saving credentials', { userId, error: error.message });
      throw error;
    }
  },

  async disconnectGoogle(userId: string) {
    try {
      const credRef = doc(db, 'users', userId, 'private', 'credentials_google');
      await deleteDoc(credRef);
      
      logger.info('CalendarService: Disconnected Google account', { userId });
      return true;
    } catch (error: any) {
      logger.error('CalendarService: Error disconnecting', { userId, error: error.message });
      throw error;
    }
  },

  async syncEventToGoogle(tokens: any, event: Omit<FamilyEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const response = await fetch("/api/calendar/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokens, event })
    });
    if (!response.ok) throw new Error("Falha ao sincronizar com Google Calendar");
    return await response.json();
  },

  async updateEventInGoogle(tokens: any, googleEventId: string, event: Partial<FamilyEvent>) {
    const response = await fetch(`/api/calendar/events/${googleEventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokens, event })
    });
    if (!response.ok) throw new Error("Falha ao atualizar no Google Calendar");
    return await response.json();
  },

  async deleteEventFromGoogle(tokens: any, googleEventId: string) {
    const response = await fetch(`/api/calendar/events/${googleEventId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokens })
    });
    if (!response.ok) throw new Error("Falha ao excluir do Google Calendar");
    return await response.json();
  }
};

// Backward compatibility or for simpler export
export const fetchGoogleCalendarEvents = calendarService.fetchGoogleCalendarEvents;
