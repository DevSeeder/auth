import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatorExtractorHelper } from 'src/helper/authenticator-extractor.helper';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        AuthenticatorExtractorHelper.extractBasicAuth(
            request.headers.authorization
        );
        return true;

        // const user = await this.userRepository.findOne({
        //     where: { username }
        // });
        // if (user && compareSync(password, user.password) !== false) {
        //     request.user = user;
        //     return true;
        // }
        //     const response = context.switchToHttp().getResponse();
        //     response.set(
        //         'WWW-Authenticate',
        //         'Basic realm="Authentication required."'
        //     ); // change this
        //     response.status(401).send();
        //     return false;
    }
}
