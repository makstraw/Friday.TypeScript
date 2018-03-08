///<reference path="LogLevel.ts"/>
namespace Friday.Logging {
    export class ConsoleLogger implements ILogger {
        private minLogLevel: LogLevel;

        LogCritical(error: string): void;
        LogCritical(errorMessage: string, e: Error): void;
        LogCritical(e: Error): void;
        LogCritical(error: string | Error, e?: Error): void {
            this.LogLine(LogLevel.Critical, error.toString());
        }

        LogDebug(msg: string, ...args): void {
             this.LogLine(LogLevel.Debug,msg,...args);
        }

        LogError(e: Error): void;
        LogError(error: string): void;
        LogError(error: string, e: Error): void;
        LogError(e: string | Error): void {
            this.LogLine(LogLevel.Error,e.toString());
        }

        LogInformation(msg: string): void {
            this.LogLine(LogLevel.Information,msg);
        }

        LogLine(level: LogLevel, line: string, ...args): void {
            if (level < this.minLogLevel) return;

            if (level === LogLevel.Trace) console.trace(line, ...args);
            else console.log(line, ...args);
        }

        LogWarning(warning: string): void {
            this.LogLine(LogLevel.Warning,warning);
        }

        Trace(msg: string, ...args): void {
            this.LogLine(LogLevel.Trace,msg);
        }

        constructor(minLogLevel: LogLevel) {
            this.minLogLevel = minLogLevel;
        }
    }
}