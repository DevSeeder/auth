import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersMongoose } from '../users.repository';
import { User } from '../users.schema';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { ScopesService } from '../../scopes/scopes.service';

dotenv.config();

@Injectable()
export class CreateUserService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly userRepository: UsersMongoose,
        private readonly scopeService: ScopesService
    ) {}

    async createUser(user: User) {
        await this.validateIfUserExists(user.username, user.projectKey);

        user.password = this.generateUserHash(user.password);

        this.logger.log(`Creating User '${user.username}'...`);

        await this.userRepository.createUser(user);

        return {
            success: true,
            response: 'User successfully created!'
        };
    }

    async validateIfUserExists(username: string, projectKey: string) {
        const users = await this.userRepository.find({
            username,
            projectKey
        });

        if (users.length > 0) {
            throw new BadRequestException(
                `User ${username} already exists for this project`
            );
        }
    }

    private generateUserHash(value: string) {
        const salt = bcrypt.genSaltSync(Number(process.env.ROUND_SALT));
        return bcrypt.hashSync(value, salt);
    }
}
