import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersMongoose } from '../users.repository';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { ValidateUserService } from './validate-user.service';
import { CreateUserDTO } from '../../../domain/dto/create-user.dto';
import { DTO } from '@devseeder/nestjs-microservices-commons';

dotenv.config();

@Injectable()
export class CreateUserService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly userRepository: UsersMongoose,
        private readonly validateUserService: ValidateUserService
    ) {}

    async createUser(user: CreateUserDTO) {
        await this.validateUser(user);

        user.password = this.generateUserHash(user.password);

        this.logger.log(`Creating User '${user.username}'...`);

        await this.userRepository.createUser(user);

        return {
            success: true,
            response: 'User successfully created!'
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
