import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from '../../../../../../src/core/local/local-auth.guard';
import { UsersMongoose } from '../../../../../../src/microservice/adapter/repository/users.repository';
import { mockAuthGuard } from '../../../../../mock/guard/guard.mock';
import { mockUserMongoose } from '../../../../../mock/repository/repository.mock';
import * as sinon from 'sinon';
import { JwtService } from '@nestjs/jwt';
import { mockJWTService } from '../../../../../mock/service/jwt-service.mock';
import { CreateUserService } from '../../../../../../src/microservice/domain/service/users/create-user.service';
import { CreateUserDTO } from '../../../../../../src/microservice/domain/dto/create-user.dto';
import {
    mockGrantUserScopesService,
    mockValidateUserService
} from '../../../../../mock/service/user-service.mock';
import { expect } from 'chai';
import { ValidateUserService } from '../../../../../../src/microservice/domain/service/users/validate-user.service';
import { GrantUserScopesService } from '../../../../../../src/microservice/domain/service/users/grant-user-scopes.service';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from '../../../../../mock/service/config-service.mock';

const mockUser = new CreateUserDTO();
mockUser.username = 'any_username';
mockUser.password = 'any_password';
mockUser.projectKey = 'any_project';

describe('CreateUserService', () => {
    let sut: CreateUserService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                CreateUserService,
                {
                    provide: UsersMongoose,
                    useValue: mockUserMongoose
                },
                {
                    provide: JwtService,
                    useValue: mockJWTService
                },
                {
                    provide: ValidateUserService,
                    useValue: mockValidateUserService
                },
                {
                    provide: GrantUserScopesService,
                    useValue: mockGrantUserScopesService
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                }
            ]
        })
            .overrideGuard(LocalAuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        sut = app.get<CreateUserService>(CreateUserService);
    });

    describe('createUser', () => {
        it('should call createUser correctly', async () => {
            const createSpy = sinon.spy(mockUserMongoose, 'createUser');

            const userStub = sinon
                .stub(mockValidateUserService, 'getUserByUsernameAndProject')
                .returns([]);

            await sut.createUser(mockUser, 'any_actualUser');

            sinon.assert.calledOnce(createSpy);

            createSpy.restore();
            userStub.restore();
        });

        it('should call createUser and thows an error for user exists', async () => {
            const createSpy = sinon.spy(mockUserMongoose, 'createUser');

            const userStub = sinon
                .stub(mockValidateUserService, 'getUserByUsernameAndProject')
                .returns([null]);

            try {
                await sut.createUser(mockUser, 'any_actualUser');
            } catch (err) {
                expect(err.message).to.be.equal(
                    'User any_username already exists for this project'
                );
            }

            createSpy.restore();
            userStub.restore();
        });
    });
});
