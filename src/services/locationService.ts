import { logger } from '../lib/logger.js';

export interface MarketLocation {
  name: string;
  address: string;
  distance?: string;
  rating?: number;
  placeId: string;
}

export const locationService = {
  async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada pelo navegador.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  },

  async findNearbyMarkets(lat: number, lng: number): Promise<MarketLocation[]> {
    try {
      const response = await fetch(`/api/location/nearby-markets?lat=${lat}&lng=${lng}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Falha ao buscar mercados próximos.');
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error: any) {
      logger.error('LocationService Error:', { error: error.message });
      throw error;
    }
  }
};
