import { FamilyEvent } from "../types";
import firebaseConfig from '../../firebase-applet-config.json';

export async function fetchGoogleCalendarEvents(accessToken: string): Promise<Omit<FamilyEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]> {
  try {
    const now = new Date().toISOString();
    const apiKey = firebaseConfig.apiKey;
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
      console.error('Google Calendar API Error Full Detail:', response.status, errorBody);
      
      throw new Error(`Erro ${response.status}: ${serverMsg}`);
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
    console.error('Calendar Service Error:', error);
    throw error;
  }
}
