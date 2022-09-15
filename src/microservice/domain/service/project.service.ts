import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { ProjectsMongoose } from '../../adapter/repository/projects.repository';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Project } from '../schema/projects.schema';
import { GLOBAL_PROJECT_KEY } from '../constants/project.const';

@Injectable()
export class ProjectService extends AbstractService {
    constructor(private projectRepository: ProjectsMongoose) {
        super();
    }
    async searchProject(key: string): Promise<Project[]> {
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
}
