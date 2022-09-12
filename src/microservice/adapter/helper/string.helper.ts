export class StringHelper {
    static ExtractLetters(str: string): string {
        return str.replace(/[^a-zA-Z]+/g, '');
    }

    static ExtractNumbers(str: string): number {
        return parseInt(str.replace(/\D/g, ''));
    }
}
