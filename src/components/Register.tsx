import { useState, useRef } from 'react';
import { User } from 'firebase/auth';
import { motion } from 'motion/react';
import { Camera, Mail, User as UserIcon, AtSign, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils.js';

interface RegisterProps {
  user: User;
  onComplete: (data: { username: string; displayName: string; bio: string; photoUrl: string }) => void;
  onCancel: () => void;
}

export const Register = ({ user, onComplete, onCancel }: RegisterProps) => {
  const [username, setUsername] = useState(user.displayName?.toLowerCase().replace(/\s/g, '') || '');
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState(user.photoURL || `https://picsum.photos/seed/${user.uid}/200`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate slight delay for polish
    setTimeout(() => {
      onComplete({ username, displayName, bio, photoUrl });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-neutral-950 overflow-y-auto">
      <div className="max-w-md mx-auto px-6 py-12 flex flex-col min-h-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1"
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Complete seu perfil</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden ring-4 ring-neutral-100 dark:ring-neutral-900 shadow-xl bg-neutral-100 dark:bg-neutral-800">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand/10">
                      <UserIcon className="w-8 h-8 text-brand/40" />
                    </div>
                  )}
                </div>
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 p-2 bg-brand text-brand-foreground rounded-xl shadow-lg hover:scale-110 transition-transform"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Foto do perfil</p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 block ml-1">Nome de Exibição</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm"
                    placeholder="Seu nome real ou apelido"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 block ml-1">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm"
                    placeholder="username_unico"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 block ml-1">Bio (Opcional)</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm min-h-[100px] resize-none"
                  placeholder="Conte um pouco sobre você para a Aimee..."
                />
              </div>

              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl flex items-start gap-3 border border-blue-100 dark:border-blue-900/20">
                <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-800/70 dark:text-blue-300/70 leading-relaxed">
                  Isso ajuda a <strong>Aimee</strong> a entender melhor sua personalidade e como ela pode ser mais útil no seu dia a dia.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full max-w-[280px] py-4 bg-brand text-brand-foreground rounded-[2rem] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all mx-auto",
                  isSubmitting && "opacity-50 pointer-events-none"
                )}
              >
                {isSubmitting ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    Solicitar Registro
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-full max-w-[280px] py-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 font-bold uppercase tracking-widest text-[10px] transition-colors mx-auto"
              >
                Cancelar e Voltar
              </button>
            </div>
          </form>
        </motion.div>

        <p className="text-center text-[10px] text-neutral-400 mt-12">
          Ao clicar em solicitar, você concorda que seus dados serão revisados por um administrador.
        </p>
      </div>
    </div>
  );
};
