type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = this.getTimestamp();
    const dataString = data ? `\nData: ${JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataString}`;
  }

  info(message: string, data?: any) {
    const formattedMessage = this.formatMessage('info', message, data);
    console.log(formattedMessage);
  }

  warn(message: string, data?: any) {
    const formattedMessage = this.formatMessage('warn', message, data);
    console.warn(formattedMessage);
  }

  error(message: string, error?: any) {
    const formattedMessage = this.formatMessage('error', message, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
    console.error(formattedMessage);
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('debug', message, data);
      console.debug(formattedMessage);
    }
  }
}

export const logger = new Logger(); 