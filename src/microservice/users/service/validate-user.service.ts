import { Injectable, Logger } from '@nestjs/common';
import { UsersMongoose } from '../users.repository';
import { User } from '../users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ValidateUserService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly userRepository: UsersMongoose) {}

    async getUserByUsernameAndProject(username: string, projectKey: string) {
        return this.userRepository.find<User>({
            username,
            projectKey: { $in: [projectKey, 'GLOBAL'] }
        });
    }

    async validateUserByCredentials(user: User, projectKey: string) {
        const userDB = await this.getUserByUsernameAndProject(
            user.username,
            projectKey
        );

        if (userDB.length === 0) return false;

        return this.validateUserPassword(user, userDB[0]);
    }

    private validateUserPassword(user: User, userDB: User) {
        return bcrypt.compareSync(user.password, userDB.password);
    }
}
