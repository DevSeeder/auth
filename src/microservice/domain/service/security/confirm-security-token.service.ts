import {
    AbstractService,
    MongooseDocument
} from '@devseeder/nestjs-microservices-commons';
import { CustomResponse } from '@devseeder/nestjs-microservices-core/dist/interface/custom-response.interface';
import { Injectable } from '@nestjs/common';
import { RandomHelper } from 'src/microservice/adapter/helper/random.helper';
import {
    EnumInvalidSecurityCodeErrorCode,
    InvalidSecurityCodeException
} from '../../../../core/error-handling/invalid-security-code.exception';
import { DateHelper } from '../../../adapter/helper/date.helper';
import { SecurityTokensMongoose } from '../../../adapter/repository/security-tokens.repository';
import { EnumBufferEncoding } from '../../enum/buffer-encoding.enum';
import { EnumTokenType } from '../../enum/enum-token-type.enum';
import {
    AttemptSecurityToken,
    SecurityToken
} from '../../schema/security-tokens.schema';

const MAX_ATTEMPTS = 3;

@Injectable()
export class ConfirmSecurityTokenService extends AbstractService {
    constructor(private securityTokenRepository: SecurityTokensMongoose) {
        super();
    }

    async confirmCode(
        tokenType: EnumTokenType,
        userId: string,
        code: string
    ): Promise<CustomResponse> {
        try {
            const token = await this.validateCode(tokenType, userId, code);

            const validationToken =
                await this.confirmAndGenerateValidationToken(
                    token._id,
                    token.expires
                );

            await this.logAttempts(token._id, code, true);

            return {
                success: true,
                response: {
                    securityTokenId: token._id,
                    validationToken
                }
            };
        } catch (err) {
            await this.logAttempts(err.refId, code, false, err.message);
            this.logger.error(err.message);
            return {
                success: false,
                response: err
            };
        }
    }

    async validateCode(
        tokenType: EnumTokenType,
        userId: string,
        code: string
    ): Promise<SecurityToken & MongooseDocument> {
        const tokensDB =
            await this.securityTokenRepository.checkConfirmationCode(
                userId,
                tokenType
            );

        if (tokensDB.length === 0) {
            throw new InvalidSecurityCodeException(
                'Token Not Found',
                null,
                EnumInvalidSecurityCodeErrorCode.INVALID_CODE
            );
        }

        if (tokensDB[0].attemps.length >= MAX_ATTEMPTS) {
            if (tokensDB[0].attemps.length == MAX_ATTEMPTS + 1) {
                await this.securityTokenRepository.inactiveActualTokens(
                    EnumTokenType.PASSWORD_RECOVERY,
                    userId
                );
            }

            throw new InvalidSecurityCodeException(
                'Too many attempts, please generate a new token',
                tokensDB[0]._id,
                EnumInvalidSecurityCodeErrorCode.MAX_ATTEMPTS
            );
        }

        const tokens = await this.securityTokenRepository.checkConfirmationCode(
            userId,
            tokenType,
            code
        );

        if (tokens.length === 0) {
            throw new InvalidSecurityCodeException(
                'Invalid Security Token',
                tokensDB[0]._id,
                EnumInvalidSecurityCodeErrorCode.INVALID_CODE
            );
        }

        if (tokens[0].expirationDate < DateHelper.GetDateNow())
            throw new InvalidSecurityCodeException(
                'Expired Code',
                tokens[0]._id,
                EnumInvalidSecurityCodeErrorCode.EXPIRED_CODE
            );

        return tokens[0];
    }

    private async confirmAndGenerateValidationToken(
        tokenId: string,
        setTime: string
    ): Promise<string> {
        const token = RandomHelper.GenerateHashString(
            12,
            EnumBufferEncoding.HEX
        );

        const expDate = DateHelper.SetAddDate(setTime);

        await this.securityTokenRepository.updateConfirmToken(
            tokenId,
            token,
            expDate
        );

        return token;
    }

    private async logAttempts(
        tokenId: string,
        attempt: string,
        assert: boolean,
        error: string = null
    ) {
        const attemptLog = new AttemptSecurityToken();
        attemptLog.attempt = attempt;
        attemptLog.assert = assert;
        attemptLog.errorMessage = error;
        attemptLog.ip = 'localhost';
        attemptLog.dateAttempt = DateHelper.GetDateNow();
        await this.securityTokenRepository.pushLogAttempt(tokenId, attemptLog);
    }
}
