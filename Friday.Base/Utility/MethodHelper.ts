namespace Friday.Utility {
    export function checkArgumentType(type: string, ...args: any[]): boolean {
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] != type) return false;
        }
        return true;
    }
}