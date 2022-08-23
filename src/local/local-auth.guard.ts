import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatorExtractorHelper } from '../helper/authenticator-extractor.helper';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
    constructor(private readonly userService: UsersService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userAuth = AuthenticatorExtractorHelper.extractBasicAuth(
            request.headers.authorization
        );

        if (await this.userService.validateUserByCredentials(userAuth)) {
            request.user = await this.userService.getUserByUsername(
                userAuth.username
            );
            return true;
        }

        throw new UnauthorizedException();
    }
}
