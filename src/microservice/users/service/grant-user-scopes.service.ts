import {
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException
} from '@nestjs/common';
import { UsersMongoose } from '../users.repository';
import { ScopesService } from '../../scopes/scopes.service';
import { GrantScopeUserDTO } from '../../../domain/dto/grant-scope-user.dto';
import { ValidateUserService } from './validate-user.service';
import { DTO } from '@devseeder/nestjs-microservices-commons';

@Injectable()
export class GrantUserScopesService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly userRepository: UsersMongoose,
        private readonly getUserService: ValidateUserService,
        private readonly scopeService: ScopesService
    ) {}

    async grantScopeForUser(scopeDTO: GrantScopeUserDTO): Promise<any> {
        DTO.validateIsAnyEmptyKey(scopeDTO);

        const userDB = await this.getUserService.getUserByUsernameAndProject(
            scopeDTO.username,
            scopeDTO.projectKey
        );

        if (userDB.length === 0) throw new NotFoundException('User not found!');

        await this.scopeService.validateScopes(scopeDTO.scopes);

        this.logger.log(`Grating user scopes...`);

        return this.userRepository.updateAddUserScopes(
            scopeDTO.username,
            scopeDTO.scopes
        );
    }

    async validateScopesForUser(
        username: string,
        scopes: string[]
    ): Promise<void> {
        const userScopesDB = await this.userRepository.getScopesByUser(
            username
        );

        for (const item of scopes) {
            if (userScopesDB.indexOf(item) === -1)
                throw new ForbiddenException(`Forbidden Scope '${item}'`);
        }
    }
}
