import {
    ExecutionContext,
    ForbiddenException,
    HttpException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { EnumAuthScopes } from '../enum/enum-auth-scopes.enum';
import { AuthenticatorExtractorHelper } from '../helper/authenticator-extractor.helper';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
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

            const tokenPayload =
                AuthenticatorExtractorHelper.extractBearerTokenAuth(
                    request.headers.authorization
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
            throw new HttpException(`Error JWT Auth: ${err.message}`, 400);
        }
    }
}
