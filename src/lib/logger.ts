
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
  private isDevelopment = process.env.NODE_ENV !== 'production';

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
    const fullEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      traceId: entry.traceId || this.generateTraceId(),
    };

    if (this.isDevelopment) {
      const color = {
        info: '\x1b[32m', // Green
        warn: '\x1b[33m', // Yellow
        error: '\x1b[31m', // Red
        debug: '\x1b[34m', // Blue
      }[fullEntry.level];
      
      console.log(
        `${color}[${fullEntry.level.toUpperCase()}]\x1b[0m [${fullEntry.timestamp}] ${fullEntry.message}`,
        fullEntry.context ? fullEntry.context : ''
      );
    } else {
      // In production, we use structured JSON for log aggregators
      console.log(JSON.stringify(fullEntry));
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
