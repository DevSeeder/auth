import {
    ExecutionContext,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { EnumAuthScopes } from '../enum/enum-auth-scopes.enum';
// import { AuthenticatorExtractorHelper } from '../helper/authenticator-extractor.helper';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector, private jwtService: JwtService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();

            if (!Object.keys(request.headers).includes('authorization'))
                throw new UnauthorizedException('No Authentication Provided');

            if (request.headers.authorization.split(' ')[0] !== 'Bearer')
                throw new UnauthorizedException(
                    'Wrong Authentication Type. Bearer Authentication is required'
                );

            const bearerToken = request.headers.authorization.replace(
                'Bearer ',
                ''
            );

            const tokenPayload = await this.jwtService.verifyAsync(
                bearerToken,
                { secret: process.env.JWT_SECRET, ignoreExpiration: true }
            );

            const scopes = this.reflector.get<string[]>(
                'scopes',
                context.getHandler()
            );

            if (!scopes || scopes.length === 0) return true;

            if (tokenPayload.scopes.indexOf(EnumAuthScopes.ADM_SCOPE) !== -1)
                return true;

            scopes.forEach((scope) => {
                if (tokenPayload.scopes.indexOf(scope) === -1) {
                    throw new ForbiddenException('Missing Scope Authorization');
                }
            });

            return true;
        } catch (err) {
            throw new HttpException(
                `Error JWT Auth: ${err.message}`,
                HttpStatus.UNAUTHORIZED
            );
        }
    }
}
