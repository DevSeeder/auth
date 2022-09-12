import { Injectable } from '@nestjs/common';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import { User } from '../../schema/users.schema';
import { UserService } from './user.service';

@Injectable()
export class ValidateUserService extends UserService {
    constructor(protected readonly userRepository: UsersMongoose) {
        super(userRepository);
    }

    async validateUserByCredentials(user: User, projectKey: string) {
        const userDB = await this.getUserByUsernameAndProject(
            user.username,
            projectKey
        );

        if (userDB.length === 0) return false;

        return this.validateUserPassword(user.password, userDB[0].password);
    }
}
