import { Injectable } from '@nestjs/common';
import {
    EnumInvalidPassErrorCode,
    InvalidPasswordException
} from '../../../../core/error-handling/invalid-update-password.exception';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import { UpdatePasswordDTO } from '../../dto/update-password.dto';
import { UserService } from './user.service';

@Injectable()
export class UpdatePasswordService extends UserService {
    constructor(protected readonly userRepository: UsersMongoose) {
        super(userRepository);
    }

    async updatePassword(passwordDTO: UpdatePasswordDTO): Promise<void> {
        await this.validatePassword(passwordDTO);
        await this.updateDBPassword(
            passwordDTO.username,
            passwordDTO.projectKey,
            passwordDTO.newPassword
        );
    }

    async validatePassword(passwordDTO: UpdatePasswordDTO): Promise<void> {
        if (passwordDTO.newPassword.length === 0)
            throw new InvalidPasswordException(
                'Empty Password',
                EnumInvalidPassErrorCode.INVALID_PASS
            );

        if (passwordDTO.newPassword !== passwordDTO.confirmPassword)
            throw new InvalidPasswordException(
                "New password and Confirm password doesn't match!",
                EnumInvalidPassErrorCode.INVALID_PASS_CONFIRM
            );

        const user = await this.getAndValidateUser(
            passwordDTO.username,
            passwordDTO.projectKey
        );

        if (
            !this.validateUserPassword(
                passwordDTO.actualPassword,
                user.password
            )
        )
            throw new InvalidPasswordException(
                'Invalid actual password!',
                EnumInvalidPassErrorCode.INVALID_ACTUAL_PASS
            );

        if (this.validateUserPassword(passwordDTO.newPassword, user.password))
            throw new InvalidPasswordException(
                `New password can't be equal actual password!`,
                EnumInvalidPassErrorCode.INVALID_PASS
            );
    }

    async updateDBPassword(
        username: string,
        projectKey: string,
        newPassword: string
    ): Promise<void> {
        await this.userRepository.updatePassword(
            username,
            projectKey,
            this.generateUserHash(newPassword)
        );
    }
}
