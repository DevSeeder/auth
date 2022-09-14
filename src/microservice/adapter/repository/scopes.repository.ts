import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthMongooseRepository } from '../../domain/repository/mongoose/auth-mongoose.repository';
import { Scope, ScopeDocument } from '../../domain/schema/scopes.schema';

@Injectable()
export class ScopesMongoose extends AuthMongooseRepository<
    Scope,
    ScopeDocument
> {
    constructor(
        @InjectModel(Scope.name)
        model: Model<ScopeDocument>
    ) {
        super(model);
    }
}