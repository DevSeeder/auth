import { User } from './../../../../../src/microservice/domain/schema/users.schema';
import { UpdateUserService } from './../../../../../src/microservice/domain/service/users/update-user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from '../../../../../src/core/local/local-auth.guard';
import { ScopesMongoose } from '../../../../../src/microservice/adapter/repository/scopes.repository';
import { ScopesService } from '../../../../../src/microservice/domain/service/scopes.service';
import { UsersMongoose } from '../../../../../src/microservice/adapter/repository/users.repository';
import { mockAuthGuard } from '../../../../mock/guard/guard.mock';
import { mockMongooseModel } from '../../../../mock/repository/mongoose.mock';
import { mockUserMongoose } from '../../../../mock/repository/repository.mock';
import { mockScopesService } from '../../../../mock/service/service.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { UsersController } from '../../../../../src/microservice/adapter/controller/users.controller';
import { GrantScopeUserDTO } from '../../../../../src/microservice/domain/dto/grant-scope-user.dto';
import { JwtService } from '@nestjs/jwt';
import { mockJWTService } from '../../../../mock/service/jwt-service.mock';
import { CreateUserDTO } from '../../../../../src/microservice/domain/dto/create-user.dto';
import { JwtAuthGuard } from '../../../../../src/core/jwt/jwt-auth.guard';
import {
    mockCreateUserService,
    mockGrantUserScopesService,
    mockUpdateUserService,
    mockValidateUserService
} from '../../../../mock/service/user-service.mock';
import { CreateUserService } from '../../../../../src/microservice/domain/service/users/create-user.service';
import { GrantUserScopesService } from '../../../../../src/microservice/domain/service/users/grant-user-scopes.service';
import { ValidateUserService } from '../../../../../src/microservice/domain/service/users/validate-user.service';

describe('UsersController', () => {
    let sut: UsersController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: GrantUserScopesService,
                    useValue: mockGrantUserScopesService
                },
                {
                    provide: CreateUserService,
                    useValue: mockCreateUserService
                },
                {
                    provide: ValidateUserService,
                    useValue: mockValidateUserService
                },
                {
                    provide: ScopesService,
                    useValue: mockScopesService
                },
                {
                    provide: UsersMongoose,
                    useValue: mockUserMongoose
                },
                {
                    provide: ScopesMongoose,
                    useValue: mockMongooseModel
                },
                {
                    provide: JwtService,
                    useValue: mockJWTService
                },
                {
                    provide: UpdateUserService,
                    useValue: mockUpdateUserService
                }
            ]
        })
            .overrideGuard(LocalAuthGuard)
            .useValue(mockAuthGuard)
            .overrideGuard(JwtAuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        sut = app.get<UsersController>(UsersController);
    });

    describe('createUser', () => {
        it('should call createUser correctly', async () => {
            const mockResponse = {
                success: true,
                response: 'User successfully created!'
            };

            const mockUser = new CreateUserDTO();
            mockUser.username = 'any_username';
            mockUser.password = 'any_password';
            mockUser.projectKey = 'any_projectKey';

            const authServiceStub = sinon
                .stub(mockCreateUserService, 'createUser')
                .returns(mockResponse);

            const actual = await sut.createUser(mockUser, 'any');
            expect(JSON.stringify(actual)).to.be.equal(
                JSON.stringify(mockResponse)
            );

            authServiceStub.restore();
        });
    });

    describe('grantscope', () => {
        it('should call grantscope correctly', async () => {
            const mockDTO = new GrantScopeUserDTO();
            mockDTO.username = 'any_username';
            mockDTO.scopes = ['scope1', 'scope2'];

            const userServiceSpy = sinon.spy(
                mockGrantUserScopesService,
                'grantScopeForUser'
            );

            await sut.grantScopeForUser(mockDTO);

            sinon.assert.calledOnceWithExactly(userServiceSpy, mockDTO);

            userServiceSpy.restore();
        });
    });

    describe('searchUser', () => {
        it('should call searchUser and return an array', async () => {
            const searchStub = sinon
                .stub(mockValidateUserService, 'searchUser')
                .returns([new User()]);

            const actual = await sut.searchUser('any', 'any', true);
            expect(JSON.stringify(actual)).to.be.equal(
                JSON.stringify([new User()])
            );

            searchStub.restore();
        });
    });

    describe('getUser', () => {
        it('should call getUser and return an object', async () => {
            const searchStub = sinon
                .stub(mockValidateUserService, 'getById')
                .returns(new User());

            const actual = await sut.getUser('any');
            expect(JSON.stringify(actual)).to.be.equal(
                JSON.stringify(new User())
            );

            searchStub.restore();
        });
    });

    describe('updateUser', () => {
        it('should call updateUser', async () => {
            const updateSpy = sinon.spy(mockUpdateUserService, 'updateById');

            await sut.updateUser('any', {});

            sinon.assert.calledOnce(updateSpy);

            updateSpy.restore();
        });
    });

    describe('activateUser', () => {
        it('should call activateUser', async () => {
            const updateSpy = sinon.spy(
                mockUpdateUserService,
                'updateUserActive'
            );

            await sut.activateUser('any');

            sinon.assert.calledOnceWithExactly(updateSpy, 'any', true);

            updateSpy.restore();
        });
    });

    describe('inactivateUser', () => {
        it('should call inactivateUser', async () => {
            const updateSpy = sinon.spy(
                mockUpdateUserService,
                'updateUserActive'
            );

            await sut.inactivateUser('any');

            sinon.assert.calledOnceWithExactly(updateSpy, 'any', false);

            updateSpy.restore();
        });
    });
});
