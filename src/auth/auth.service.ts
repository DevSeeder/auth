import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorExtractorHelper } from 'src/helper/authenticator-extractor.helper';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtTokenService: JwtService,
        private readonly usersService: UsersService
    ) {}

    async loginWithCredentials(headerAuth: any) {
        const user = AuthenticatorExtractorHelper.extractBasicAuth(headerAuth);
        const payload = { username: user.username, sub: 1 };

        return {
            access_token: this.jwtTokenService.sign(payload)
        };
    }
}
