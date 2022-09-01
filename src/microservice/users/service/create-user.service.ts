import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersMongoose } from '../users.repository';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { ValidateUserService } from './validate-user.service';
import { CreateUserDTO } from '../../../domain/dto/create-user.dto';
import { DTO } from '@devseeder/nestjs-microservices-commons';
import { GrantUserScopesService } from './grant-user-scopes.service';

dotenv.config();

@Injectable()
export class CreateUserService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly userRepository: UsersMongoose,
        private readonly validateUserService: ValidateUserService,
        private readonly grantScopesService: GrantUserScopesService
    ) {}

    async createUser(user: CreateUserDTO) {
        const scopes = user.scopes;

        await this.validateUser(user);

        user.password = this.generateUserHash(user.password);

        this.logger.log(`Creating User '${user.username}'...`);
        const id = await this.userRepository.createUser(user);

        if (scopes && scopes.length > 0)
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
            throw new BadRequestException(
                `User ${user.username} already exists for this project`
            );
        }
    }

    private generateUserHash(value: string) {
        const salt = bcrypt.genSaltSync(Number(process.env.ROUND_SALT));
        return bcrypt.hashSync(value, salt);
    }
}
