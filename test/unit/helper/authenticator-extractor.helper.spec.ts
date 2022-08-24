import { AuthenticatorExtractorHelper } from '../../../src/helper/authenticator-extractor.helper';

describe('AuthenticatorExtractorHelper', () => {
    describe('extractBasicAuth', () => {
        it('Should call extractBasicAuth', () => {
            const actual = AuthenticatorExtractorHelper.extractBasicAuth('');
            expect(actual.username).toBe('');
        });
    });
});
