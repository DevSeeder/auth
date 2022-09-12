import {
    Injectable,
    Logger,
    NotAcceptableException,
    NotFoundException
} from '@nestjs/common';
import { ScopesMongoose } from '../../adapter/repository/scopes.repository';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ScopesService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private scopeRepository: ScopesMongoose) {}

    async validateScopes(scopes: string[]): Promise<void> {
        if (scopes.length === 0)
            throw new NotAcceptableException('Empty Scopes');

        for await (const item of scopes) {
            await this.validateScopeById(item);
        }
    }

    async validateScopeById(scopeID: string): Promise<void> {
        this.logger.log(`Validating Scope...`);
        const scopeRes = await this.scopeRepository.find({
            scopeID
        });

        if (scopeRes.length === 0)
            throw new NotFoundException(`Scope '${scopeID}' is invalid!`);
    }
}
