import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from '../../../src/core/local/local-auth.guard';
import { ScopesMongoose } from '../../../src/microservice/scopes/scope.repository';
import { ScopesService } from '../../../src/microservice/scopes/scopes.service';
import { UsersMongoose } from '../../../src/microservice/users/users.repository';
import { GrantUserScopesService } from '../../../src/microservice/users/service/grant-user-scopes.service';
import { mockAuthGuard } from '../../mock/guard/guard.mock';
import { mockMongooseModel } from '../../mock/repository/mongoose.mock';
import { mockUserMongoose } from '../../mock/repository/repository.mock';
import { mockScopesService } from '../../mock/service/service.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { UsersController } from '../../../src/microservice/users/users.controller';
import { GrantScopeUserDTO } from '../../../src/domain/dto/grant-scope-user.dto';
import { JwtService } from '@nestjs/jwt';
import { mockJWTService } from '../../mock/service/jwt-service.mock';
import { CreateUserDTO } from '../../../src/domain/dto/create-user.dto';
import { JwtAuthGuard } from '../../../src/core/jwt/jwt-auth.guard';
import {
    mockCreateUserService,
    mockGrantUserScopesService,
    mockValidateUserService
} from '../../mock/service/user-service.mock';
import { CreateUserService } from '../../../src/microservice/users/service/create-user.service';
import { ValidateUserService } from '../../../src/microservice/users/service/validate-user.service';

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

            const actual = await sut.createUser(mockUser);
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
});
