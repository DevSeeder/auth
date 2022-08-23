import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '../mongoose/mongoose.repository';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersMongoose extends MongooseRepository<User, UserDocument> {
    constructor(
        @InjectModel(User.name)
        model: Model<UserDocument>
    ) {
        super(model);
    }
}
