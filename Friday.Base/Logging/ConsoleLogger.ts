namespace Friday.Logging {
    import Exception = Friday.Exceptions.Exception;

    export class ConsoleLogger implements ILogger {
        private minLogLevel: LogLevel;

        LogCritical(error: string): void;
        LogCritical(errorMessage: string, e: Error): void;
        LogCritical(e: Error): void;
        LogCritical(error: string | Error, e?: Error): void {
            throw new Error("Not implemented");
        }

        LogDebug(msg: string): void {
             this.LogLine(LogLevel.Debug,msg);
        }

        LogError(e: Error): void;
        LogError(error: string): void;
        LogError(error: string, e: Error): void;
        LogError(e: string | Error): void {
            throw new Error("Not implemented");
        }

        LogInformation(msg: string): void { throw new Error("Not implemented"); }

        LogLine(level: LogLevel, line: string): void {
            if (level < this.minLogLevel) return;

            console.log(line);
        }

        LogWarning(warning: string): void { throw new Error("Not implemented"); }

        Trace(msg: string): void { throw new Error("Not implemented"); }

        constructor(minLogLevel: LogLevel) {
            this.minLogLevel = minLogLevel;
        }
    }
}