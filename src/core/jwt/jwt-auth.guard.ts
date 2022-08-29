import {
    ExecutionContext,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { EnumAuthScopes } from '../../domain/enum/enum-auth-scopes.enum';
import * as dotenv from 'dotenv';
import { AbstractGuard } from '../guard/abstract-guard.guard';

dotenv.config();

@Injectable()
export class JwtAuthGuard extends AbstractGuard {
    constructor(private reflector: Reflector, private jwtService: JwtService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const bearerToken = this.getAuthToken(context, 'Bearer').replace(
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
                err.status === HttpStatus.ACCEPTED
                    ? HttpStatus.UNAUTHORIZED
                    : err.status
            );
        }
    }
}
