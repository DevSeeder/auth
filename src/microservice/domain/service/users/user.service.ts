import { ProjectService } from './../project.service';
import {
    AbstractService,
    MongooseDocument
} from '@devseeder/nestjs-microservices-commons';
import { Injectable, HttpStatus } from '@nestjs/common';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import * as bcrypt from 'bcrypt';
import { User } from '../../schema/users.schema';
import {
    NotFoundException,
    CustomErrorException
} from '@devseeder/microservices-exceptions';
import { ConfigService } from '@nestjs/config';

@Injectable()
export abstract class UserService extends AbstractService {
    constructor(
        protected readonly userRepository: UsersMongoose,
        protected configService: ConfigService,
        protected readonly projectService: ProjectService
    ) {
        super();
    }

    generateUserHash(value: string): string {
        const salt = bcrypt.genSaltSync(
            Number(this.configService.get('auth.password.round-salt'))
        );
        return bcrypt.hashSync(value, salt);
    }

    protected validateUserPassword(
        password: string,
        passwordDB: string
    ): boolean {
        return bcrypt.compareSync(password, passwordDB);
    }

    async getAndValidateUser(
        username: string,
        projectKey: string
    ): Promise<User & MongooseDocument> {
        await this.projectService.validateProjectByKey(projectKey);

        const user = await this.getUserByUsernameAndProject(
            username,
            projectKey
        );

        if (user.length === 0) throw new NotFoundException('User');

        if (!user[0].active)
            throw new CustomErrorException(
                'User inactive!',
                HttpStatus.BAD_REQUEST
            );

        return user[0];
    }

    async getUserByUsernameAndProject(
        username: string,
        projectKey: string
    ): Promise<User[]> {
        return this.userRepository.find<User>(
            {
                username,
                projectKey: { $in: [projectKey, 'GLOBAL'] }
            },
            {
                _id: 1,
                name: 1,
                username: 1,
                password: 1,
                projectKey: 1,
                scopes: 1,
                active: 1
            }
        );
    }

    async getById(id: string): Promise<User> {
        const res = await this.userRepository.findById(id);
        if (!res) throw new NotFoundException('User');

        return res;
    }

    async getAndValidateUserById(id): Promise<any> {
        const user = await this.getById(id);
        if (!user.active)
            throw new CustomErrorException(
                'User inactive!',
                HttpStatus.BAD_REQUEST
            );
    }
}
