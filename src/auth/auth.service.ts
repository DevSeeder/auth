import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorExtractorHelper } from 'src/helper/authenticator-extractor.helper';
import { ScopesService } from 'src/scopes/scopes.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtTokenService: JwtService,
        private readonly usersService: UsersService,
        private readonly scopesService: ScopesService
    ) {}

    async loginWithCredentials(headerAuth: string, scopes: string[]) {
        const user = AuthenticatorExtractorHelper.extractBasicAuth(headerAuth);

        await this.scopesService.validateScopes(scopes);

        await this.usersService.validateScopesForUser(user.username, scopes);

        const payload = { username: user.username, scopes: scopes };

        return {
            access_token: this.jwtTokenService.sign(payload)
        };
    }
}
