import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { ProjectsMongoose } from '../../adapter/repository/projects.repository';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Project } from '../schema/projects.schema';
import {
    DEFAULT_PROJECT_SCOPES,
    GLOBAL_PROJECT_KEY
} from '../constants/project.const';
import { CreateProjectDTO } from '../dto/create-project.dto';
import { ScopesService } from './scopes.service';
import { CreateScopeDTO } from '../dto/create-scope.dto';

@Injectable()
export class ProjectService extends AbstractService {
    constructor(
        private readonly projectRepository: ProjectsMongoose,
        private readonly scopesService: ScopesService
    ) {
        super();
    }
    async searchProject(key = ''): Promise<Project[]> {
        return this.projectRepository.searchProject(key);
    }

    async getProjectByKey(key: string): Promise<any> {
        return this.projectRepository.getProjectByKey(key);
    }

    async validateProjectByKey(key: string): Promise<boolean> {
        this.logger.log(`Validating projectKey '${key}'...`);
        if (key == GLOBAL_PROJECT_KEY) return true;

        const project = await this.getProjectByKey(key);

        if (!project)
            throw new CustomErrorException(
                `Project '${key}' is invalid!`,
                HttpStatus.BAD_REQUEST
            );

        return true;
    }

    async createProject(item: CreateProjectDTO): Promise<void> {
        this.logger.log(`Creating project projectKey '${item.projectKey}'...`);
        await this.projectRepository.insertOne(item, 'Auth Project');
        this.logger.log('Creating Scopes');

        for await (const resource of item.resources) {
            this.logger.log(`Creating Scopes for resource '${resource}'...`);

            for await (const scopeAccKey of DEFAULT_PROJECT_SCOPES) {
                const scope: CreateScopeDTO = {
                    accessKey: scopeAccKey,
                    scopeID: `${item.scopeKey}/${resource}/${scopeAccKey}`,
                    description: `${scopeAccKey} scope`,
                    projectKey: item.projectKey,
                    resourceKey: resource
                };
                await this.scopesService.createScope(scope);
            }
            this.logger.log(`Scopes created for resource '${resource}'...`);
        }
        this.logger.log('Project created.');
    }
}
