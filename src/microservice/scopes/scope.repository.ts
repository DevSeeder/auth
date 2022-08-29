import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '../../repository/mongoose/mongoose.repository';
import { Scope, ScopeDocument } from './scopes.schema';

@Injectable()
export class ScopesMongoose extends MongooseRepository<Scope, ScopeDocument> {
    constructor(
        @InjectModel(Scope.name)
        model: Model<ScopeDocument>
    ) {
        super(model);
    }
}
