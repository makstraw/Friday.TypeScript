namespace Friday.Logging {
    export interface ILogger {
        LogCritical(error: string) : void;
        LogCritical(errorMessage: string, e: Error) : void;
        LogCritical(e: Error) : void;
        LogDebug(msg: string) : void;
        LogError(e: Error) : void;
        LogError(error: string) : void;
        LogError(error: string, e: Error) : void;
        LogInformation(msg: string ) : void;
        LogLine(level: LogLevel, line : string) : void;
        LogWarning(warning: string) : void;
        Trace(msg: string) : void;
    }

}