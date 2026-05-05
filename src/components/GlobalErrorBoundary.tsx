import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let isConfigError = false;
      let errorData: any = null;

      try {
        if (this.state.errorInfo) {
          errorData = JSON.parse(this.state.errorInfo);
          if (errorData && (errorData.code === 'MISSING_ENV_VAR' || errorData.operationType)) {
            isConfigError = true;
          }
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6 text-neutral-900 dark:text-neutral-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-neutral-100 dark:border-neutral-800 text-center"
          >
            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
            </div>

            <h1 className="text-2xl font-black mb-4 tracking-tight">
              Oops! Algo deu errado.
            </h1>
            
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed font-medium">
              {isConfigError 
                ? "Tivemos um problema com a configuração do sistema. O administrador já foi notificado."
                : "A Aimee encontrou um obstáculo inesperado enquanto processava seus dados."}
            </p>

            {isConfigError && errorData && (
               <div className="mb-8 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-left">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Detalhes do Erro</p>
                  <p className="text-xs font-mono text-rose-500 break-all">
                    {errorData.code === 'MISSING_ENV_VAR' 
                      ? `Variável Ausente: ${errorData.variable || (errorData.missing ? errorData.missing.join(', ') : 'Desconhecida')}`
                      : `Falha na Operação: ${errorData.operationType || 'Desconhecida'} em ${errorData.path || 'Global'}`}
                  </p>
               </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={this.handleReset}
                className="w-full py-4 bg-brand text-brand-foreground rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand/20 flex items-center justify-center gap-3 active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCcw className="w-4 h-4" />
                Tentar Novamente
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full py-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Ir para Início
              </button>
            </div>

            <p className="mt-8 text-[10px] text-neutral-400 font-medium italic">
              ID do Erro: {Math.random().toString(36).substring(2, 9).toUpperCase()}
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children || null;
  }
}
