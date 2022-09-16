import { HttpStatus, Injectable } from '@nestjs/common';
import { ValidateUserService } from './validate-user.service';
import { DTO } from '@devseeder/nestjs-microservices-commons';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import { ScopesService } from '../scopes.service';
import { GrantScopeUserDTO } from '../../dto/grant-scope-user.dto';
import { User } from '../../schema/users.schema';
import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { ForbbidenScopeException } from '../../../../core/error-handling/forbbiden-scope.exception';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ProjectService } from '../project.service';

@Injectable()
export class GrantUserScopesService extends UserService {
    constructor(
        protected readonly userRepository: UsersMongoose,
        private readonly getUserService: ValidateUserService,
        private readonly scopeService: ScopesService,
        protected configService: ConfigService,
        protected readonly projectService: ProjectService
    ) {
        super(userRepository, configService, projectService);
    }

    async grantScopeForUser(scopeDTO: GrantScopeUserDTO): Promise<any> {
        DTO.validateIsAnyEmptyKey(scopeDTO);

        await this.projectService.validateProjectByKey(scopeDTO.projectKey);

        const userDB: User[] = await this.getAndValidateUser(
            scopeDTO.username,
            scopeDTO.projectKey
        );

        const scopes = scopeDTO.scopes.filter((scope) => {
            return userDB[0].scopes.indexOf(scope) == -1;
        });

        if (scopes.length === 0)
            throw new CustomErrorException(
                'All the Scopes are already in the user.',
                HttpStatus.NOT_ACCEPTABLE
            );

        await this.scopeService.validateScopes(scopes);

        this.logger.log(`Grating user scopes...`);

        await this.userRepository.updateAddUserScopes(
            scopeDTO.username,
            scopeDTO.projectKey,
            scopes
        );
    }

    async validateScopesForUser(
        username: string,
        projectKey: string,
        scopes: string[]
    ): Promise<void> {
        await this.projectService.validateProjectByKey(projectKey);

        const userScopesDB = await this.userRepository.getScopesByUser(
            username,
            projectKey
        );

        for (const item of scopes) {
            const admScope = this.getAdmScope(item);
            if (
                userScopesDB.indexOf(item) === -1 &&
                userScopesDB.indexOf(admScope) === -1
            )
                throw new ForbbidenScopeException(item);
        }
    }

    private getAdmScope(scope: string): string {
        const scopeParts = scope.split('/');
        scopeParts.pop();
        scopeParts.push('ADM');
        return scopeParts.join('/');
    }
}
