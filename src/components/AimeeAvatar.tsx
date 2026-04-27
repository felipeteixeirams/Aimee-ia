import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface AimeeAvatarProps {
  src: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const AimeeAvatar = ({ src, className, size = "md" }: AimeeAvatarProps) => {
  const dimensions = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-10 h-10";
  
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800", dimensions, className)}>
      {src ? (
        <motion.img 
          src={src} 
          className="w-full h-full object-cover" 
          alt="Aimee" 
          referrerPolicy="no-referrer"
          animate={{
            scale: [1, 1.08, 1],
            y: [0, -2, 0],
            filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-1/2 h-1/2 bg-brand/20 rounded-full blur-sm animate-pulse" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brand/20 to-transparent pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
    </div>
  );
};
