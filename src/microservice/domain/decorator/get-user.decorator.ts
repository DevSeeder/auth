import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatorExtractorHelper } from '../../adapter/helper/authenticator-extractor.helper';

export const GetUser = createParamDecorator(
    async (_data, ctx: ExecutionContext): Promise<string> => {
        const req = ctx.switchToHttp().getRequest();
        const payload = AuthenticatorExtractorHelper.extractBearerTokenAuth(
            req.headers.authorization.replace('Bearer ', '')
        );
        return payload.username;
    }
);
