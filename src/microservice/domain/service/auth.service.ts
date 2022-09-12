import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorExtractorHelper } from '../../adapter/helper/authenticator-extractor.helper';
import { ScopesService } from './scopes.service';
import { GrantUserScopesService } from '../../domain/service/users/grant-user-scopes.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtTokenService: JwtService,
        private readonly usersService: GrantUserScopesService,
        private readonly scopesService: ScopesService
    ) {}

    async loginWithCredentials(headerAuth: string, scopes: string[]) {
        const user = AuthenticatorExtractorHelper.extractBasicAuth(headerAuth);

        await this.scopesService.validateScopes(scopes);

        await this.usersService.validateScopesForUser(user.username, scopes);

        const payload = { username: user.username, scopes: scopes };

        return {
            token: this.jwtTokenService.sign(payload)
        };
    }
}