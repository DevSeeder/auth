import { User } from './../../../../../../src/microservice/domain/schema/users.schema';
import { UpdateUserService } from './../../../../../../src/microservice/domain/service/users/update-user.service';
import { mockProjectService } from '../../../../../mock/service/service.mock';
import { ProjectService } from '../../../../../../src/microservice/domain/service/project.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from '../../../../../../src/core/local/local-auth.guard';
import { UsersMongoose } from '../../../../../../src/microservice/adapter/repository/users.repository';
import { mockAuthGuard } from '../../../../../mock/guard/guard.mock';
import { mockUserMongoose } from '../../../../../mock/repository/repository.mock';
import * as sinon from 'sinon';
import { CreateUserDTO } from '../../../../../../src/microservice/domain/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from '../../../../../mock/service/config-service.mock';

const mockUser = new CreateUserDTO();
mockUser.username = 'any_username';
mockUser.password = 'any_password';
mockUser.projectKey = 'any_project';

describe('UpdateUserService', () => {
    let sut: UpdateUserService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                UpdateUserService,
                {
                    provide: UsersMongoose,
                    useValue: mockUserMongoose
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                },
                {
                    provide: ProjectService,
                    useValue: mockProjectService
                }
            ]
        })
            .overrideGuard(LocalAuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        sut = app.get<UpdateUserService>(UpdateUserService);
    });

    describe('updateById', () => {
        it('should call updateById correctly', async () => {
            const updateSpy = sinon.spy(mockUserMongoose, 'updateInfo');
            const mockUser = new User();
            mockUser.active = true;

            const userStub = sinon
                .stub(mockUserMongoose, 'findById')
                .returns(mockUser);

            await sut.updateById('any', {});

            sinon.assert.calledOnce(updateSpy);

            updateSpy.restore();
            userStub.restore();
        });
    });

    describe('updateUserActive', () => {
        it('should call updateUserActive correctly with true', async () => {
            const updateSpy = sinon.spy(mockUserMongoose, 'updateActive');

            await sut.updateUserActive('any', true);

            sinon.assert.calledOnce(updateSpy);

            updateSpy.restore();
        });

        it('should call updateUserActive correctly with false', async () => {
            const updateSpy = sinon.spy(mockUserMongoose, 'updateActive');

            await sut.updateUserActive('any', false);

            sinon.assert.calledOnce(updateSpy);

            updateSpy.restore();
        });
    });
});
