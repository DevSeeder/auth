import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import {
    Injectable,
    Logger,
    NotAcceptableException,
    NotFoundException
} from '@nestjs/common';
import { ScopesMongoose } from '../../adapter/repository/scopes.repository';
import * as dotenv from 'dotenv';
import { Scope } from '../schema/scopes.schema';

dotenv.config();

@Injectable()
export class ScopesService extends AbstractService {
    constructor(private scopeRepository: ScopesMongoose) {
        super();
    }

    async validateScopes(scopes: string[]): Promise<void> {
        if (scopes.length === 0)
            throw new NotAcceptableException('Empty Scopes');

        for await (const item of scopes) {
            await this.validateScopeById(item);
        }
    }

    async searchScopes(
        id = '',
        projectKey = '',
        resourceKey = ''
    ): Promise<Scope[]> {
        return this.scopeRepository.searchScope(id, projectKey, resourceKey);
    }

    async validateScopeById(scopeID: string): Promise<void> {
        this.logger.log(`Validating Scope...`);
        const scopeRes = await this.scopeRepository.find({
            scopeID
        });

        if (scopeRes.length === 0)
            throw new NotFoundException(`Scope '${scopeID}' is invalid!`);

        return scopeRes[0];
    }
}
