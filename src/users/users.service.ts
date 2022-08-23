import { Injectable } from '@nestjs/common';
import { UsersMongoose } from './users.repository';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UsersService {
    constructor(private userRepository: UsersMongoose) {}

    async createUser(user: User) {
        user.password = this.generateUserHash(user.password);

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
}
