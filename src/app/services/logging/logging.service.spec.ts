import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggingService } from '@app/services/logging/logging.service';
import { environment } from '@env/environment';
import { LogLevel } from '@app/enum/enum';
import { LogEntry } from '@app/interface/interface';
import { of } from 'rxjs';

describe('LoggingService Batch Processing', () => {
  let loggingService: LoggingService;
  let originalEnvironment: any;

  let consoleDebugSpy: jasmine.Spy;
  let consoleInfoSpy: jasmine.Spy;
  let consoleWarnSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    originalEnvironment = { ...environment };
    environment.production = true;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoggingService],
    });
    loggingService = TestBed.inject(LoggingService);

    consoleDebugSpy = spyOn(console, 'debug');
    consoleInfoSpy = spyOn(console, 'info');
    consoleWarnSpy = spyOn(console, 'warn');
    consoleErrorSpy = spyOn(console, 'error');

    localStorage.removeItem('app_logs');
  });

  afterEach(() => {
    Object.assign(environment, originalEnvironment);
  });

  it('should limit local storage logs to MAX_LOCAL_LOGS (100)', () => {
    for (let i = 0; i < 110; i++) {
      loggingService.info(`Log message ${i}`);
    }

    for (let i = 0; i < 110; i++) {
      loggingService.warn(`Log message ${i}`);
    }

    for (let i = 0; i < 110; i++) {
      loggingService.debug(`Log message ${i}`);
    }

    const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
    expect(logs.length).toBe(100);
    expect(logs[0].message).toBe('Log message 10');
    expect(logs[99].message).toBe('Log message 109');
  });

  it('should call log with LogLevel.Error and call flushLogs when error is logged', () => {
    const message = 'Test error message';
    const fileName = 'testFile.ts';
    const functionName = 'testFunction';
    const errorDetails = 'Detailed error information';

    const logSpy = spyOn(loggingService as any, 'log');

    const flushLogsSpy = spyOn(loggingService, 'flushLogs');

    loggingService.error(message, fileName, functionName, errorDetails);

    expect(logSpy).toHaveBeenCalledWith(
      LogLevel.Error,
      message,
      fileName,
      functionName,
      errorDetails
    );

    expect(flushLogsSpy).toHaveBeenCalled();
  });

  it('should log to the console based on the log level', () => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      logLevel: LogLevel.Debug,
      message: 'This is a debug message',
      stackTrace: '',
      fileName: '',
      error: '',
    };

    const loggingServiceAny = loggingService as any;

    loggingServiceAny.logToConsole(logEntry);
    expect(consoleDebugSpy).toHaveBeenCalledWith(
      `[${logEntry.timestamp}] ${logEntry.logLevel}: ${logEntry.message}`,
      logEntry.stackTrace,
      logEntry.fileName,
      logEntry.error
    );

    logEntry.logLevel = LogLevel.Info;

    loggingServiceAny.logToConsole(logEntry);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      `[${logEntry.timestamp}] ${logEntry.logLevel}: ${logEntry.message}`,
      logEntry.stackTrace,
      logEntry.fileName,
      logEntry.error
    );

    logEntry.logLevel = LogLevel.Warn;

    loggingServiceAny.logToConsole(logEntry);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `[${logEntry.timestamp}] ${logEntry.logLevel}: ${logEntry.message}`,
      logEntry.stackTrace,
      logEntry.fileName,
      logEntry.error
    );

    logEntry.logLevel = LogLevel.Error;

    loggingServiceAny.logToConsole(logEntry);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `[${logEntry.timestamp}] ${logEntry.logLevel}: ${logEntry.message}`,
      logEntry.stackTrace,
      logEntry.fileName,
      logEntry.error
    );
  });

  it('should log an error when storing log locally fails', () => {
    spyOn(localStorage, 'setItem').and.throwError('localStorage is full');

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      logLevel: LogLevel.Error,
      message: 'This is a test log message',
      stackTrace: '',
      fileName: '',
      error: '',
    };

    loggingService['storeLocally'](logEntry);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error storing log locally:',
      jasmine.any(Error)
    );
    expect(consoleErrorSpy.calls.mostRecent().args[1].message).toBe(
      'localStorage is full'
    );
  });

  it('should return an empty array if an error occurs while retrieving logs from localStorage', () => {
    spyOn(localStorage, 'getItem').and.throwError('localStorage read error');

    const result = loggingService['getLocalLogs']();

    expect(result).toEqual([]);
  });

  it('should call sendBatchToServer when there are pending logs', () => {
    loggingService['pendingLogs'] = [
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Info,
        message: 'Log 1',
      },
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Error,
        message: 'Log 2',
      },
    ];

    const sendBatchToServerSpy = spyOn(
      loggingService as any,
      'sendBatchToServer'
    );

    loggingService.flushLogs();

    expect(sendBatchToServerSpy).toHaveBeenCalledWith([
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Info,
        message: 'Log 1',
      },
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Error,
        message: 'Log 2',
      },
    ]);

    expect(loggingService['pendingLogs'].length).toBe(0);
  });

  it('should return an empty array when there are no logs in localStorage', () => {
    localStorage.removeItem('app_logs');

    const exportedLogs = loggingService.exportLogs();

    expect(exportedLogs).toEqual([]);
  });

  it('should send logs to the server and log success on success', fakeAsync(() => {
    const logs = [
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Info,
        message: 'Log 1',
      },
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Error,
        message: 'Log 2',
      },
    ];

    const httpResponse = { status: 200, statusText: 'OK' };
    const postSpy = spyOn(loggingService['http'], 'post').and.returnValue(
      of(httpResponse)
    );

    const consoleLogSpy = spyOn(console, 'log');

    loggingService['sendBatchToServer'](logs);
    tick();

    expect(postSpy).toHaveBeenCalledWith(
      `${environment.BASE_URL}/client/logging`,
      logs
    );
    expect(consoleLogSpy).toHaveBeenCalledWith('Logs sent successfully');
  }));

  it('should add logs to pendingLogs array', () => {
    const logs = [
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Info,
        message: 'Log 1',
      },
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Error,
        message: 'Log 2',
      },
    ];

    loggingService['storePendingLogs'](logs);

    expect(loggingService['pendingLogs'].length).toBe(2);
    expect(loggingService['pendingLogs'][0].message).toBe('Log 1');
    expect(loggingService['pendingLogs'][1].message).toBe('Log 2');
  });

  it('should retry sending pending logs after timeout', fakeAsync(() => {
    const logs = [
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Info,
        message: 'Log 1',
      },
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Error,
        message: 'Log 2',
      },
    ];

    const httpResponse = { status: 200, statusText: 'OK' };
    const postSpy = spyOn(loggingService['http'], 'post').and.returnValue(
      of(httpResponse)
    );

    loggingService['storePendingLogs'](logs);

    const retrySpy = spyOn(
      loggingService as any,
      'retryPendingLogs'
    ).and.callThrough();

    loggingService['retryPendingLogs']();
    tick(5000);

    expect(retrySpy).toHaveBeenCalled();
    expect(postSpy).toHaveBeenCalledWith(
      `${environment.BASE_URL}/client/logging`,
      logs
    );
  }));

  it('should send error logs to the server when in production', () => {
    const logs: LogEntry[] = [
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Info,
        message: 'Info message',
      },
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Error,
        message: 'Error message',
      },
    ];

    environment.production = true;

    const sendBatchToServerSpy = spyOn(
      loggingService as any,
      'sendBatchToServer'
    );

    loggingService['processBatch'](logs);

    expect(sendBatchToServerSpy).toHaveBeenCalledWith([
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Error,
        message: 'Error message',
      },
    ]);
  });

  it('should send error logs to the server when in production', () => {
    const logs: LogEntry[] = [
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Info,
        message: 'Info message',
      },
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Error,
        message: 'Error message',
      },
    ];

    environment.production = true;

    const sendBatchToServerSpy = spyOn(
      loggingService as any,
      'sendBatchToServer'
    );

    loggingService['processBatch'](logs);

    expect(sendBatchToServerSpy).toHaveBeenCalledWith([
      {
        timestamp: new Date().toISOString(),
        logLevel: LogLevel.Error,
        message: 'Error message',
      },
    ]);
  });

  it('should return early if logs array is empty', () => {
    const logs: LogEntry[] = [];

    const sendBatchToServerSpy = spyOn(
      loggingService as any,
      'sendBatchToServer'
    );

    loggingService['processBatch'](logs);

    expect(sendBatchToServerSpy).not.toHaveBeenCalled();
  });

  it('should log to the console when not in production', () => {
    const message = 'Test message';
    const logLevel = LogLevel.Info;

    environment.production = false;

    const logToConsoleSpy = spyOn(loggingService as any, 'logToConsole');

    loggingService['log'](logLevel, message);

    expect(logToConsoleSpy).toHaveBeenCalled();
  });

  it('should call logSubject.next when log level is LogLevel.Error', () => {
    const message = 'Test error message';
    const logLevel = LogLevel.Error;
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      logLevel,
      message,
      stackTrace: window.location.href + ' ' + navigator.userAgent,
      fileName: undefined,
      functionName: undefined,
      error: undefined,
    };

    const logSubjectSpy = spyOn(loggingService['logSubject'], 'next');

    loggingService['log'](logLevel, message);

    expect(logSubjectSpy).toHaveBeenCalledWith(logEntry);
  });
});
