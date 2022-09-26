import { Project, ProjectDocument } from '../../domain/schema/projects.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthMongooseRepository } from '../../domain/repository/mongoose/auth-mongoose.repository';

@Injectable()
export class ProjectsMongoose extends AuthMongooseRepository<
    Project,
    ProjectDocument
> {
    constructor(
        @InjectModel(Project.name)
        model: Model<ProjectDocument>
    ) {
        super(model);
    }

    async searchProject(name = ''): Promise<Array<Project>> {
        const regexName = new RegExp(name, 'i');
        return this.find<Project[]>(
            {
                $or: [
                    { name: { $regex: regexName } },
                    { projectKey: { $regex: regexName } }
                ]
            },
            {},
            { name: 1 }
        );
    }

    async getProjectByKey(key: string) {
        return this.findOne<Project>(
            {
                projectKey: key
            },
            { _id: 0 }
        );
    }
}
