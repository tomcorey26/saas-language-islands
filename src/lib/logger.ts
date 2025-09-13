const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  service?: string;
  requestId?: string;
}

class Logger {
  private readonly enabled = isDevelopment || isProduction; // Always enabled, but different outputs
  private readonly service = 'islands-of-language';

  // Log level hierarchy for filtering
  private readonly logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private readonly minLogLevel: LogLevel = isDevelopment ? 'debug' : 'info';

  private shouldLog(level: LogLevel): boolean {
    return this.enabled && this.logLevels[level] >= this.logLevels[this.minLogLevel];
  }

  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    // Remove or mask sensitive information
    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'apiKey', 'authorization'];

    for (const key of Object.keys(sanitized)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private formatError(error: unknown): Record<string, unknown> {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: isDevelopment ? error.stack : undefined,
        cause: error.cause,
      };
    }
    return { value: error };
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const sanitizedContext = this.sanitizeContext(context);

    // Format context for better error handling
    const formattedContext = sanitizedContext ? {
      ...sanitizedContext,
      error: sanitizedContext.error ? this.formatError(sanitizedContext.error) : undefined,
    } : undefined;

    if (isDevelopment) {
      // Development: Human-readable console output
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
      const consoleMethod = level === 'debug' ? console.debug :
                           level === 'info' ? console.info :
                           level === 'warn' ? console.warn :
                           console.error;

      if (formattedContext) {
        consoleMethod(prefix, message, formattedContext);
      } else {
        consoleMethod(prefix, message);
      }
    } else {
      // Production: Structured JSON logging
      const structuredLog: StructuredLog = {
        timestamp,
        level,
        message,
        service: this.service,
        ...(formattedContext && { context: formattedContext }),
      };

      console.log(JSON.stringify(structuredLog));
    }

    // For errors, also track to external service in production
    if (level === 'error' && isProduction) {
      this.trackError();
    }
  }

  private trackError(): void {
    // In production, you might want to send errors to an external service
    // like Sentry, LogRocket, or similar
    try {
      // Example: Send to external error tracking service
      // This is a placeholder - implement based on your error tracking service
      if (typeof globalThis !== 'undefined' && 'fetch' in globalThis) {
        // Could send to error tracking endpoint
        // fetch('/api/internal/error-tracking', {
        //   method: 'POST',
        //   body: JSON.stringify({ message, context, timestamp: new Date().toISOString() })
        // }).catch(() => {}); // Silent fail to avoid logging loops
      }
    } catch {
      // Silent fail to avoid logging loops
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  // Convenience method for timing operations
  time<T>(operation: string, fn: () => Promise<T>, context?: LogContext): Promise<T> {
    const start = Date.now();
    this.debug(`Starting operation: ${operation}`, { ...context, operation });

    return fn().then(
      (result) => {
        const duration = Date.now() - start;
        this.info(`Completed operation: ${operation}`, {
          ...context,
          operation,
          duration,
          success: true
        });
        return result;
      },
      (error) => {
        const duration = Date.now() - start;
        this.error(`Failed operation: ${operation}`, {
          ...context,
          operation,
          duration,
          success: false,
          error
        });
        throw error;
      }
    );
  }
}

export const logger = new Logger();