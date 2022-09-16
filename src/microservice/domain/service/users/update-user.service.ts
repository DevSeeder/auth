import { CustomResponse } from '@devseeder/nestjs-microservices-core/dist/interface/custom-response.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import { UpdateUserDTO } from '../../dto/update-user.dto';
import { ProjectService } from '../project.service';
import { UserService } from './user.service';

@Injectable()
export class UpdateUserService extends UserService {
    constructor(
        protected readonly userRepository: UsersMongoose,
        protected configService: ConfigService,
        protected readonly projectService: ProjectService
    ) {
        super(userRepository, configService, projectService);
    }

    async updateById(
        id: string,
        user: Partial<UpdateUserDTO>
    ): Promise<CustomResponse> {
        await this.getAndValidateUserById(id);
        await this.userRepository.updateInfo(id, user);
        return {
            success: true,
            response: 'User successfully updated!'
        };
    }

    async updateUserActive(
        id: string,
        active: boolean
    ): Promise<CustomResponse> {
        await this.userRepository.updateActive(id, active);
        const action = active ? 'activated' : 'inactivated';

        return {
            success: true,
            response: `User successfully ${action}!`
        };
    }
}
