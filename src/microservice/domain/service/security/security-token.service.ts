import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { DateHelper } from '../../../adapter/helper/date.helper';
import { RandomHelper } from '../../../adapter/helper/random.helper';
import { SecurityTokensMongoose } from '../../../adapter/repository/security-tokens.repository';
import { EnumBufferEncoding } from '../../enum/buffer-encoding.enum';
import { EnumCodeType } from '../../enum/enum-code-type.enum';
import { EnumTokenType } from '../../enum/enum-token-type.enum';
import { SecurityToken } from '../../schema/security-tokens.schema';
import { ValidateUserService } from '../users/validate-user.service';

@Injectable()
export class SecurityTokenService extends AbstractService {
    constructor(
        private securityTokenRepository: SecurityTokensMongoose,
        private validateUserService: ValidateUserService
    ) {
        super();
    }

    async generateSecurityToken(
        type: EnumTokenType,
        userId: string,
        codeType: EnumCodeType,
        lenght,
        expires
    ): Promise<string> {
        await this.inactivateActualTokens(type, userId);

        const token = new SecurityToken();
        token.active = true;
        token.userId = userId;
        token.expires = expires;
        token.expirationDate = DateHelper.SetAddDate(expires);
        token.tokenType = type;
        token.codeType = codeType;
        token.lenght = lenght;
        token.token = this.generateCode(codeType, lenght).toString();
        await this.securityTokenRepository.insertOne(token, 'Security Token');
        return token.token;
    }

    async inactivateActualTokens(
        type: EnumTokenType,
        userId: string
    ): Promise<void> {
        await this.securityTokenRepository.inactiveActualTokens(type, userId);
    }

    private generateCode(codeType: EnumCodeType, lenght: number) {
        if (codeType == EnumCodeType.NUMBER)
            return RandomHelper.GenerateRandomNumber(lenght);

        return RandomHelper.GenerateHashString(lenght, EnumBufferEncoding.HEX);
    }
}
