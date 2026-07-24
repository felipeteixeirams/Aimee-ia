import { useState } from 'react';
import { useAuth } from './useAuth';
import { ReceiptExtraction } from '../../models/index';
import { config } from '../../lib/config';

export function useVisionProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality to ensure it's under 2MB
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          // Remove the data:image/jpeg;base64, part
          const base64 = dataUrl.split(',')[1];
          resolve(base64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const processReceipt = async (file: File): Promise<ReceiptExtraction | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      const base64Image = await compressImage(file);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${config.appUrl}/api/vision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imagePayloadBase64: base64Image,
          mimeType: 'image/jpeg',
          userId: user?.uid,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao processar imagem');
      }

      const result: ReceiptExtraction = await response.json();
      return result;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Tempo limite excedido ao processar a imagem. Tente novamente.');
      } else {
        setError(err.message || 'Erro desconhecido');
      }
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processReceipt,
    isProcessing,
    error,
  };
}
