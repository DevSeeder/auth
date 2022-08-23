export class AuthenticatorExtractorHelper {
    static extractBasicAuth(header: string) {
        const b64auth = (header || '').split(' ')[1] || '';
        const [username, password] = Buffer.from(b64auth, 'base64')
            .toString()
            .split(':');
        return { username, password };
    }
}
