import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthMongooseRepository } from '../../repository/mongoose/auth-mongoose.repository';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersMongoose extends AuthMongooseRepository<User, UserDocument> {
    constructor(
        @InjectModel(User.name)
        model: Model<UserDocument>
    ) {
        super(model);
    }

    async createUser(user: User) {
        user.scopes = [];
        return this.insertOne(user, 'User');
    }

    async updateAddUserScopes(username: string, scopes: string[]) {
        return this.updateOne(
            {
                username
            },
            {},
            {
                scopes: { $each: scopes }
            }
        );
    }

    async getScopesByUser(username: string): Promise<string[]> {
        const response = await this.find<User>(
            {
                username
            },
            { scopes: 1 }
        );

        if (response.length === 0)
            throw new NotFoundException('User not found!');

        return response[0].scopes;
    }
}
