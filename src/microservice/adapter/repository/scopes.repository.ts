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

    async searchScope(
        id: string,
        projectKey = '',
        resourceKey = ''
    ): Promise<Array<Scope>> {
        const regexName = new RegExp(id, 'i');

        const searchParams = {};

        if (id.length > 0) searchParams['scopeID'] = { $regex: regexName };

        if (projectKey.length > 0) searchParams['projectKey'] = projectKey;

        if (resourceKey.length > 0)
            searchParams['resourceKey'] = {
                $in: ['*', resourceKey]
            };

        return this.find<Scope[]>(searchParams, {}, { scopeID: 1 });
    }
}
