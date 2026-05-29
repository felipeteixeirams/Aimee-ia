import { motion } from 'motion/react';
import { cn } from '../../lib/utils.js';

interface AimeeAvatarProps {
  src: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const AimeeAvatar = ({ src, className, size = "md" }: AimeeAvatarProps) => {
  const dimensions = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-10 h-10";
  
  return (
    <div className={cn("relative overflow-hidden rounded-[1.25rem] bg-neutral-100 dark:bg-neutral-800 shadow-lg shrink-0", dimensions, className)}>
      <motion.div 
        className="absolute inset-0 bg-brand p-1 opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {src ? (
        <motion.img 
          src={src} 
          className="w-full h-full object-cover relative z-10" 
          alt="Aimee" 
          referrerPolicy="no-referrer"
          animate={{
            scale: [1, 1.05, 1],
            y: [0, -1, 0],
            filter: ["brightness(1) contrast(1)", "brightness(1.1) contrast(1.05)", "brightness(1) contrast(1)"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center relative z-10">
          <div className="w-1/2 h-1/2 bg-brand/30 rounded-full blur-md animate-pulse" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brand/30 via-transparent to-brand/10 pointer-events-none mix-blend-overlay z-20" />
      <div className="absolute inset-0 ring-2 ring-inset ring-brand/20 rounded-[1.25rem] pointer-events-none z-30" />
    </div>
  );
};
