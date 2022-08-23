import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ScopesMongoose } from './scope.repository';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ScopesService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private scopeRepository: ScopesMongoose) {}

    async validateScopeById(scopeID: string): Promise<void> {
        this.logger.log(`Validating Scope...`);
        const scopeRes = this.scopeRepository.find({
            scopeID
        });

        if ((await scopeRes).length === 0)
            throw new NotFoundException(`Scope ${scopeID} is invalid!`);
    }
}
