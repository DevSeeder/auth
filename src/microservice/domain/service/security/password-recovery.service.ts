import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { CustomResponse } from '@devseeder/nestjs-microservices-core/dist/interface/custom-response.interface';
import { Injectable } from '@nestjs/common';
import { EnumCodeType } from '../../enum/enum-code-type.enum';
import { EnumTokenType } from '../../enum/enum-token-type.enum';
import { GenerateSecurityTokenService } from './generate-security-token.service';
import { ValidateUserService } from '../users/validate-user.service';
import { MailService } from '../mail/mail.service';
import { MailSendingException } from 'src/core/error-handling/mail-sending.exception';
import { User } from '../../schema/users.schema';
import { ConfirmSecurityTokenService } from './confirm-security-token.service';
import { ValidationTokenService } from './validation-token.service';
import { UpdatePasswordService } from '../users/update-password.service';
import { UpdatePasswordCodeDTO } from '../../dto/update-password.dto';

const CODE_LENGHT = 6;
const EXPIRES = '3h';

@Injectable()
export class PasswordRecoveryService extends AbstractService {
    constructor(
        private securityTokenService: GenerateSecurityTokenService,
        private confirmSecurityTokenService: ConfirmSecurityTokenService,
        private validationTokenService: ValidationTokenService,
        private validateUserService: ValidateUserService,
        private updatePasswordService: UpdatePasswordService,
        private mailService: MailService
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

        const token = await this.securityTokenService.generateSecurityToken(
            EnumTokenType.PASSWORD_RECOVERY,
            user._id,
            EnumCodeType.NUMBER,
            CODE_LENGHT,
            EXPIRES
        );

        await this.sendEmail(user, token);

        return {
            success: true,
            response: 'Recovery Code sent to email!'
        };
    }

    async confirmPassCode(
        username: string,
        projectKey: string,
        code: string
    ): Promise<CustomResponse> {
        const user = await this.validateUserService.getAndValidateUser(
            username,
            projectKey
        );

        return this.confirmSecurityTokenService.confirmCode(
            EnumTokenType.PASSWORD_RECOVERY,
            user._id,
            code
        );
    }

    async sendEmail(user: User, token: string) {
        this.logger.log('Sending email...');
        try {
            await this.mailService.sendEmail(
                'maicksantos05@hotmail.com',
                'Password Recovery',
                './confirmation',
                {
                    name: user.name,
                    token
                }
            );
        } catch (err) {
            throw new MailSendingException(err.message);
        }
        this.logger.log('Email successfully sent!');
    }

    async updateRecoverPassword(
        passDto: UpdatePasswordCodeDTO
    ): Promise<CustomResponse> {
        await this.validationTokenService.checkValidationToken(
            passDto.validationTokenId,
            passDto.validationCode
        );

        await this.updatePasswordService.updatePassword(passDto, false);

        return { success: true, response: 'Password successfully updated!' };
    }
}
