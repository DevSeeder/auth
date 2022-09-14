import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import {
    EnumInvalidSecurityCodeErrorCode,
    InvalidSecurityCodeException
} from '../../../../core/error-handling/invalid-security-code.exception';
import { DateHelper } from '../../../adapter/helper/date.helper';
import { SecurityTokensMongoose } from '../../../adapter/repository/security-tokens.repository';
import { EnumTokenType } from '../../enum/enum-token-type.enum';

@Injectable()
export class ValidationTokenService extends AbstractService {
    constructor(private securityTokenRepository: SecurityTokensMongoose) {
        super();
    }

    async checkValidationToken(tokenId: string, validationCode: string) {
        const securityToken = await this.securityTokenRepository.findById(
            tokenId
        );

        if (!securityToken) {
            throw new InvalidSecurityCodeException(
                'Token Not Found',
                null,
                EnumInvalidSecurityCodeErrorCode.INVALID_VALIDATION_CODE
            );
        }

        if (securityToken.validated) {
            throw new InvalidSecurityCodeException(
                'Token Already Validated',
                null,
                EnumInvalidSecurityCodeErrorCode.ALREADY_VALIDATED_VALIDATION_CODE
            );
        }

        if (securityToken.validationToken !== validationCode) {
            throw new InvalidSecurityCodeException(
                'Invalid Validation Token',
                null,
                EnumInvalidSecurityCodeErrorCode.INVALID_VALIDATION_CODE
            );
        }

        if (securityToken.expDateValidationToken < DateHelper.GetDateNow()) {
            throw new InvalidSecurityCodeException(
                'Expired Validation Token',
                null,
                EnumInvalidSecurityCodeErrorCode.EXPIRED_VALIDATION_CODE
            );
        }

        await this.securityTokenRepository.inactiveActualTokens(
            EnumTokenType.PASSWORD_RECOVERY,
            securityToken.userId,
            true
        );

        return securityToken.userId;
    }
}
