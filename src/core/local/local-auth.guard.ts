import { AbstractGuard } from '@devseeder/nestjs-microservices-core';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { AuthenticatorExtractorHelper } from '../../helper/authenticator-extractor.helper';
import { ValidateUserService } from '../../microservice/users/service/validate-user.service';

@Injectable()
export class LocalAuthGuard extends AbstractGuard implements CanActivate {
    constructor(private readonly validateUserService: ValidateUserService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (
            !request.headers.projectkey ||
            request.headers.projectkey.length === 0
        )
            throw new UnauthorizedException('ProjectKey is required!');

        const tokenAuth = this.getAuthToken(context, 'Basic');

        const userAuth =
            AuthenticatorExtractorHelper.extractBasicAuth(tokenAuth);

        if (
            await this.validateUserService.validateUserByCredentials(
                userAuth,
                request.headers.projectkey
            )
        ) {
            request.user =
                await this.validateUserService.getUserByUsernameAndProject(
                    userAuth.username,
                    request.headers.projectkey
                );
            return true;
        }

        throw new UnauthorizedException();
    }
}
