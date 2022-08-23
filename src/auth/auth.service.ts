import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorExtractorHelper } from 'src/helper/authenticator-extractor.helper';

@Injectable()
export class AuthService {
    constructor(private jwtTokenService: JwtService) {}

    async validateUserCredentials(): // username: string,
    // password: string,
    Promise<any> {
        // // const user = await this.usersService.findOne(username);

        // if (user && user.password === password) {
        //   const { ...result } = user;
        //   delete result.password;
        //   return result;
        // }
        return true;
    }

    async loginWithCredentials(headerAuth: any) {
        const user = AuthenticatorExtractorHelper.extractBasicAuth(headerAuth);
        const payload = { username: user.user, sub: 1 };

        return {
            access_token: this.jwtTokenService.sign(payload)
        };
    }
}
