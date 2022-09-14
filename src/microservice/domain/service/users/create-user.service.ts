import { Injectable } from '@nestjs/common';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import * as dotenv from 'dotenv';
import { ValidateUserService } from './validate-user.service';
import { CreateUserDTO } from '../../dto/create-user.dto';
import { DTO } from '@devseeder/nestjs-microservices-commons';
import { GrantUserScopesService } from './grant-user-scopes.service';
import { EnumAuthScopes } from '../../enum/enum-auth-scopes.enum';
import { UserService } from './user.service';
import { UserAlreadyExistsException } from '../../../../core/error-handling/user-already-exists.exception';
import { ConfigService } from '@nestjs/config';

dotenv.config();

@Injectable()
export class CreateUserService extends UserService {
    constructor(
        protected readonly userRepository: UsersMongoose,
        private readonly validateUserService: ValidateUserService,
        private readonly grantScopesService: GrantUserScopesService,
        protected configService: ConfigService
    ) {
        super(userRepository, configService);
    }

    async createUser(user: CreateUserDTO, actualUser: string) {
        const scopes = user.scopes;

        await this.validateUser(user);

        if (scopes && scopes.length > 0)
            await this.grantScopesService.validateScopesForUser(
                actualUser,
                'AUTH',
                [EnumAuthScopes.GRANT_SCOPE]
            );

        user.password = this.generateUserHash(user.password);

        this.logger.log(`Creating User '${user.username}'...`);
        const id = await this.userRepository.createUser(user);

        await this.grantScopesService.grantScopeForUser({
            ...user,
            scopes
        });

        return {
            success: true,
            response: {
                message: 'User successfully created!',
                userId: id
            }
        };
    }

    async validateUser(user: CreateUserDTO) {
        DTO.validateIsAnyEmptyKey(user);

        const users =
            await this.validateUserService.getUserByUsernameAndProject(
                user.username,
                user.projectKey
            );

        if (users.length > 0) {
            throw new UserAlreadyExistsException(user.username);
        }
    }
}
