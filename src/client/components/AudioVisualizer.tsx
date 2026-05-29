import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  getFrequencyData: () => Uint8Array;
  isRecording: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ getFrequencyData, isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRecording) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const dataArray = getFrequencyData();
      const bufferLength = dataArray.length;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        // Gradient based on height
        const blue = Math.floor((dataArray[i] / 255) * 100) + 150;
        ctx.fillStyle = `rgb(59, 130, 246, ${dataArray[i] / 255 + 0.2})`;
        
        // Draw bars
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, getFrequencyData]);

  return (
    <canvas 
      ref={canvasRef} 
      width={200} 
      height={40} 
      className="rounded-lg opacity-80"
    />
  );
};
