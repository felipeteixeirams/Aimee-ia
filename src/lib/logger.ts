
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  traceId?: string;
}

class Logger {
  private static instance: Logger;
  private isDevelopment = (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') || 
                          (typeof (import.meta as any).env !== 'undefined' && (import.meta as any).env.DEV);

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private generateTraceId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private log(entry: Omit<LogEntry, 'timestamp'>) {
    const context = entry.context || {};
    
    // Better Error serialization
    if (context.error instanceof Error) {
      context.error = {
        message: context.error.message,
        stack: context.error.stack,
        name: context.error.name,
        code: (context.error as any).code
      };
    }

    const fullEntry: any = {
      severity: entry.level.toUpperCase(), // Google Cloud standard
      level: entry.level,
      message: entry.message,
      timestamp: new Date().toISOString(),
      traceId: entry.traceId || this.generateTraceId(),
      userId: entry.userId,
      ...context
    };

    if (this.isDevelopment) {
      const color = {
        info: '\x1b[32m', // Green
        warn: '\x1b[33m', // Yellow
        error: '\x1b[31m', // Red
        debug: '\x1b[34m', // Blue
      }[entry.level];
      
      console.log(
        `${color}[${entry.level.toUpperCase()}]\x1b[0m [${fullEntry.timestamp}] ${entry.message}`,
        entry.context ? '\nContext:' : '',
        entry.context || ''
      );
    } else {
      // Direct JSON output for Google Cloud Logging
      try {
        console.log(JSON.stringify(fullEntry));
      } catch (err) {
        // Fallback for circular references or non-serializable objects
        console.log(JSON.stringify({
          severity: 'ERROR',
          level: 'error',
          message: 'Failed to stringify log entry',
          timestamp: new Date().toISOString(),
          originalMessage: entry.message
        }));
      }
    }
  }

  public info(message: string, context?: Record<string, any>, userId?: string) {
    this.log({ level: 'info', message, context, userId });
  }

  public warn(message: string, context?: Record<string, any>, userId?: string) {
    this.log({ level: 'warn', message, context, userId });
  }

  public error(message: string, context?: Record<string, any>, userId?: string) {
    this.log({ level: 'error', message, context, userId });
  }

  public debug(message: string, context?: Record<string, any>, userId?: string) {
    this.log({ level: 'debug', message, context, userId });
  }
}

export const logger = Logger.getInstance();
