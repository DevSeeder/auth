import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { CustomResponse } from '@devseeder/nestjs-microservices-core/dist/interface/custom-response.interface';
import { Injectable } from '@nestjs/common';
import { EnumCodeType } from '../../enum/enum-code-type.enum';
import { EnumTokenType } from '../../enum/enum-token-type.enum';
import { SecurityTokenService } from './security-token.service';
import { ValidateUserService } from '../users/validate-user.service';

const CODE_LENGHT = 6;
const EXPIRES = '3h';

@Injectable()
export class PasswordRecoveryService extends AbstractService {
    constructor(
        private securityTokenService: SecurityTokenService,
        private validateUserService: ValidateUserService
    ) {
        super();
    }

    async generatePasswordRecoveryToken(
        username: string,
        projectKey: string
    ): Promise<CustomResponse> {
        const user = await this.validateUserService.getAndValidateUser(
            username,
            projectKey
        );
        await this.securityTokenService.generateSecurityToken(
            EnumTokenType.PASSWORD_RECOVERY,
            user._id,
            EnumCodeType.NUMBER,
            CODE_LENGHT,
            EXPIRES
        );

        return {
            success: true,
            response: 'Recovery Code sent to email!'
        };
    }
}
