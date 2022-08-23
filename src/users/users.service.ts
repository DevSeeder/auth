import { Injectable, Logger } from '@nestjs/common';
import { UsersMongoose } from './users.repository';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UsersService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private userRepository: UsersMongoose) {}

    async createUser(user: User) {
        user.password = this.generateUserHash(user.password);

        this.logger.log(`Creating User '${user.username}'...`);

        await this.userRepository.insertOne(user, 'User');
        return {
            success: true,
            response: 'User successfully created!'
        };
    }

    private generateUserHash(value: string) {
        const salt = bcrypt.genSaltSync(Number(process.env.ROUND_SALT));
        return bcrypt.hashSync(value, salt);
    }

    async getUserByUsername(username: string) {
        return this.userRepository.find<User>({
            username
        });
    }

    async validateUserByCredentials(user: User) {
        const userDB = await this.getUserByUsername(user.username);

        if (userDB.length === 0) return false;

        return this.validateUserPassword(user, userDB[0]);
    }

    private validateUserPassword(user: User, userDB: User) {
        return bcrypt.compareSync(user.password, userDB.password);
    }
}
