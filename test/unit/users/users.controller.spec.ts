import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from '../../../src/local/local-auth.guard';
import { ScopesMongoose } from '../../../src/scopes/scope.repository';
import { ScopesService } from '../../../src/scopes/scopes.service';
import { UsersMongoose } from '../../../src/users/users.repository';
import { UsersService } from '../../../src/users/users.service';
import { mockAuthGuard } from '../../mock/guard/guard.mock';
import { mockMongooseModel } from '../../mock/repository/mongoose.mock';
import { mockUserMongoose } from '../../mock/repository/repository.mock';
import {
    mockScopesService,
    mockUserService
} from '../../mock/service/service.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { UsersController } from '../../../src/users/users.controller';
import { User } from '../../../src/users/users.schema';
import { GrantScopeUserDTO } from '../../../src/dto/grant-scope-user.dto';
import { JwtService } from '@nestjs/jwt';
import { mockJWTService } from '../../mock/service/jwt-service.mock';

describe('UsersController', () => {
    let sut: UsersController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUserService
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
            .compile();

        sut = app.get<UsersController>(UsersController);
    });

    describe('createUser', () => {
        it('should call createUser correctly', async () => {
            const mockResponse = {
                success: true,
                response: 'User successfully created!'
            };

            const mockUser = new User();
            mockUser.username = 'any_username';
            mockUser.password = 'any_password';

            const authServiceStub = sinon
                .stub(mockUserService, 'createUser')
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
                mockUserService,
                'grantScopeForUser'
            );

            await sut.grantScopeForUser(mockDTO);

            sinon.assert.calledOnceWithExactly(userServiceSpy, mockDTO);

            userServiceSpy.restore();
        });
    });
});
