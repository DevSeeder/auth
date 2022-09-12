import {
    HttpStatus,
    Injectable,
    Logger,
    NotFoundException
} from '@nestjs/common';
import { ValidateUserService } from './validate-user.service';
import { DTO } from '@devseeder/nestjs-microservices-commons';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import { ScopesService } from '../scopes.service';
import { GrantScopeUserDTO } from '../../dto/grant-scope-user.dto';
import { User } from '../../schema/users.schema';
import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { ForbbidenScopeException } from '../../../../core/error-handling/forbbiden-scope.exception';

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

        const userDB: User[] =
            await this.getUserService.getUserByUsernameAndProject(
                scopeDTO.username,
                scopeDTO.projectKey
            );

        if (userDB.length === 0) throw new NotFoundException('User not found!');

        const scopes = scopeDTO.scopes.filter((scope) => {
            return userDB[0].scopes.indexOf(scope) == -1;
        });

        console.log('scopes -->');
        console.log(scopes);

        if (scopes.length === 0)
            throw new CustomErrorException(
                'All the Scopes are already in the user.',
                HttpStatus.NOT_ACCEPTABLE
            );

        await this.scopeService.validateScopes(scopes);

        this.logger.log(`Grating user scopes...`);

        await this.userRepository.updateAddUserScopes(
            scopeDTO.username,
            scopes
        );
    }

    async validateScopesForUser(
        username: string,
        projectKey: string,
        scopes: string[]
    ): Promise<void> {
        const userScopesDB = await this.userRepository.getScopesByUser(
            username,
            projectKey
        );

        for (const item of scopes) {
            const admScope = this.getAdmScope(item);
            console.log('admScope');
            console.log(admScope);
            if (
                userScopesDB.indexOf(item) === -1 &&
                userScopesDB.indexOf(admScope) === -1
            )
                throw new ForbbidenScopeException(item);
        }
    }

    private getAdmScope(scope: string): string {
        let scopeParts = scope.split('/');
        scopeParts.pop();
        scopeParts.push('ADM');
        return scopeParts.join('/');
    }
}
