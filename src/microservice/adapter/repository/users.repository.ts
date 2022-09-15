import { GLOBAL_PROJECT_KEY } from './../../domain/constants/project.const';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthMongooseRepository } from '../../domain/repository/mongoose/auth-mongoose.repository';
import { User, UserDocument } from '../../domain/schema/users.schema';

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

    async updateAddUserScopes(
        username: string,
        projectKey: string,
        scopes: string[]
    ) {
        return this.model.updateOne(
            {
                username,
                projectKey: { $in: [projectKey, 'GLOBAL'] }
            },
            {
                $push: {
                    scopes: { $each: scopes }
                }
            }
        );
    }

    async getScopesByUser(
        username: string,
        projectKey: string
    ): Promise<string[]> {
        const response = await this.find<User>(
            {
                username,
                projectKey: { $in: [projectKey, 'GLOBAL'] }
            },
            { scopes: 1 }
        );

        if (response.length === 0)
            throw new NotFoundException('User not found!');

        return response[0].scopes;
    }

    async updatePassword(
        username: string,
        projectKey: string,
        password: string
    ) {
        return this.model.updateOne(
            {
                username,
                projectKey: { $in: [projectKey, 'GLOBAL'] }
            },
            {
                $set: { password }
            }
        );
    }

    async searchUser(name = '', projectKey = ''): Promise<Array<User>> {
        const regexName = new RegExp(name, 'i');

        const searchParams = {};

        if (name.length > 0)
            searchParams['$or'] = [
                { name: { $regex: regexName } },
                { username: { $regex: regexName } }
            ];

        if (projectKey.length > 0)
            searchParams['projectKey'] = {
                $in: [GLOBAL_PROJECT_KEY, projectKey]
            };

        return this.find<User[]>(
            searchParams,
            { _id: 1, name: 1, username: 1, projectKey: 1 },
            { scopeID: 1 }
        );
    }
}
