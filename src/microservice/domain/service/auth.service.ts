import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorExtractorHelper } from '../../adapter/helper/authenticator-extractor.helper';
import { ScopesService } from './scopes.service';
import { GrantUserScopesService } from '../../domain/service/users/grant-user-scopes.service';
import { ProjectService } from './project.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtTokenService: JwtService,
        private readonly usersService: GrantUserScopesService,
        private readonly scopesService: ScopesService,
        private readonly projectService: ProjectService
    ) {}

    async loginWithCredentials(
        headerAuth: string,
        projectKey: string,
        scopes: string[]
    ) {
        const user = AuthenticatorExtractorHelper.extractBasicAuth(headerAuth);

        await this.projectService.validateProjectByKey(projectKey);

        await this.scopesService.validateScopes(scopes);

        await this.usersService.validateScopesForUser(
            user.username,
            projectKey,
            scopes
        );

        const payload = { username: user.username, scopes: scopes };

        return {
            token: this.jwtTokenService.sign(payload)
        };
    }
}
