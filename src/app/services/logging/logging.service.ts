import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, interval, takeUntil, buffer, filter } from 'rxjs';
import { environment } from '@env/environment';
import { LogEntry } from '@app/interface/interface';
import { LogLevel } from '@app/enum/enum';

@Injectable({
  providedIn: 'root',
})
export class LoggingService implements OnDestroy {
  private readonly LOCAL_STORAGE_KEY = 'app_logs';
  private readonly MAX_LOCAL_LOGS = 100;
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL = 10000;

  private logSubject = new Subject<LogEntry>();
  private destroySubject = new Subject<void>();
  private pendingLogs: LogEntry[] = [];

  constructor(private http: HttpClient) {
    this.setupBatchProcessing();
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.flushLogs();
  }

  private setupBatchProcessing() {
    const timer$ = interval(this.FLUSH_INTERVAL);
    this.logSubject
      .pipe(
        buffer(timer$),
        filter((logs) => logs.length > 0),
        takeUntil(this.destroySubject)
      )
      .subscribe((logs) => {
        this.processBatch(logs);
      });

    this.logSubject
      .pipe(
        buffer(
          this.logSubject.pipe(
            filter(
              (_, index) => index % this.BATCH_SIZE === this.BATCH_SIZE - 1
            )
          )
        ),
        takeUntil(this.destroySubject)
      )
      .subscribe((logs) => {
        this.processBatch(logs);
      });
  }

  debug(
    message: string,
    fileName?: string,
    functionName?: string,
    error?: string
  ): void {
    this.log(LogLevel.Debug, message, fileName, functionName, error);
  }

  info(
    message: string,
    fileName?: string,
    functionName?: string,
    error?: string
  ): void {
    this.log(LogLevel.Info, message, fileName, functionName, error);
  }

  warn(
    message: string,
    fileName?: string,
    functionName?: string,
    error?: string
  ): void {
    this.log(LogLevel.Warn, message, fileName, functionName, error);
  }

  error(
    message: string,
    fileName?: string,
    functionName?: string,
    error?: string
  ): void {
    this.log(LogLevel.Error, message, fileName, functionName, error);
    this.flushLogs();
  }

  private log(
    logLevel: LogLevel,
    message: string,
    fileName?: string,
    functionName?: string,
    error?: string
  ): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      logLevel,
      message,
      stackTrace: window.location.href + ' ' + navigator.userAgent,
      fileName: fileName,
      functionName: functionName,
      error: error,
      // argument: null,
    };
    if (!environment.production) {
      this.logToConsole(logEntry);
    }
    this.storeLocally(logEntry);
    if (logLevel === LogLevel.Error) {
      this.logSubject.next(logEntry);
    }
  }

  private processBatch(logs: LogEntry[]): void {
    if (logs.length === 0) return;
    const errorLogs = logs.filter((log) => log.logLevel === LogLevel.Error);
    if (environment.production && errorLogs.length > 0) {
      this.sendBatchToServer(errorLogs);
    }
  }

  private sendBatchToServer(logs: LogEntry[]): void {
    this.http.post(`${environment.BASE_URL}/client/logging`, logs).subscribe({
      next: () => {
        console.log('Logs sent successfully');
      },
      error: (error) => {
        console.error('Error sending batch logs to server:', error);
        this.storePendingLogs(logs);
      },
    });
  }

  private storePendingLogs(logs: LogEntry[]): void {
    this.pendingLogs.push(...logs);
    this.retryPendingLogs();
  }

  private retryPendingLogs(): void {
    if (this.pendingLogs.length > 0) {
      setTimeout(() => {
        const logsToRetry = [...this.pendingLogs];
        this.pendingLogs = [];
        this.sendBatchToServer(logsToRetry);
      }, 5000);
    }
  }

  private logToConsole(entry: LogEntry): void {
    const formattedMessage = `[${entry.timestamp}] ${entry.logLevel}: ${entry.message}`;
    switch (entry.logLevel) {
      case LogLevel.Debug:
        console.debug(
          formattedMessage,
          entry.stackTrace || '',
          entry.fileName || '',
          entry.error || ''
        );
        break;
      case LogLevel.Info:
        console.info(
          formattedMessage,
          entry.stackTrace || '',
          entry.fileName || '',
          entry.error || ''
        );
        break;
      case LogLevel.Warn:
        console.warn(
          formattedMessage,
          entry.stackTrace || '',
          entry.fileName || '',
          entry.error || ''
        );
        break;
      case LogLevel.Error:
        console.error(
          formattedMessage,
          entry.stackTrace || '',
          entry.fileName || '',
          entry.error || ''
        );
        break;
    }
  }

  private storeLocally(entry: LogEntry): void {
    try {
      const logs = this.getLocalLogs() || [];
      logs.push(entry);

      while (logs.length > this.MAX_LOCAL_LOGS) {
        logs.shift();
      }

      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error storing log locally:', error);
    }
  }

  private getLocalLogs(): LogEntry[] {
    try {
      const logs = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  flushLogs(): void {
    const currentLogs = [...this.pendingLogs];
    this.pendingLogs = [];
    if (currentLogs.length > 0) {
      this.sendBatchToServer(currentLogs);
    }
  }

  exportLogs(): LogEntry[] {
    return this.getLocalLogs();
  }
}
