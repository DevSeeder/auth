import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { AbstractGuard } from '../guard/abstract-guard.guard';
import { AuthenticatorExtractorHelper } from '../../helper/authenticator-extractor.helper';
import { UsersService } from '../../microservice/users/users.service';

@Injectable()
export class LocalAuthGuard extends AbstractGuard implements CanActivate {
    constructor(private readonly userService: UsersService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const tokenAuth = this.getAuthToken(context, 'Basic');

        const userAuth =
            AuthenticatorExtractorHelper.extractBasicAuth(tokenAuth);

        if (await this.userService.validateUserByCredentials(userAuth)) {
            request.user = await this.userService.getUserByUsername(
                userAuth.username
            );
            return true;
        }

        throw new UnauthorizedException();
    }
}
