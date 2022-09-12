import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EnumAuthScopes } from '../../domain/enum/enum-auth-scopes.enum';
import { JwtAuthGuard } from '../../../core/jwt/jwt-auth.guard';
import { Scopes } from '@devseeder/nestjs-microservices-core';
import { UpdatePasswordDTO } from '../../domain/dto/update-password.dto';
import { UpdatePasswordService } from '../../domain/service/users/update-password.service';
import {
    ForgotPasswordConfirmDTO,
    ForgotPasswordDTO
} from '../../domain/dto/forgot-password.dto';
import { PasswordRecoveryService } from '../../domain/service/security/password-recovery.service';

@Controller('security')
export class SecurityController {
    constructor(
        private readonly updatePasswordService: UpdatePasswordService,
        private readonly passwordRecoveryService: PasswordRecoveryService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.UPDATE_PASSWORD)
    @Post('/password/update')
    async updatePassword(@Body() passDTO: UpdatePasswordDTO) {
        return this.updatePasswordService.updatePassword(passDTO);
    }

    @Post('/password/forgot')
    async forgetPassword(@Body() passDTO: ForgotPasswordDTO) {
        return this.passwordRecoveryService.generatePasswordRecoveryToken(
            passDTO.username,
            passDTO.projectKey
        );
    }

    @Post('/password/forgot/confirm')
    async confirmCodeForgotPassword(@Body() passDTO: ForgotPasswordConfirmDTO) {
        return this.passwordRecoveryService.confirmPassCode(
            passDTO.username,
            passDTO.projectKey,
            passDTO.code
        );
    }
}
