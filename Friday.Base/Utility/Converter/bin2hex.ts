namespace Friday.Utility.Converter {
    
    export function bin2hex(binaryData: string): string {
        if (binaryData == null) return "";
        
        let output: string = "";
        for (let i=0;i<binaryData.length;i++){
            output += binaryData.charCodeAt(i).toString(16);
        }
        return output;
    }
}