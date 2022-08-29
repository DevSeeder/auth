import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from '../../../src/core/local/local-auth.guard';
import { ScopesMongoose } from '../../../src/microservice/scopes/scope.repository';
import { ScopesService } from '../../../src/microservice/scopes/scopes.service';
import { UsersMongoose } from '../../../src/microservice/users/users.repository';
import { UsersService } from '../../../src/microservice/users/service/users.service';
import { mockAuthGuard } from '../../mock/guard/guard.mock';
import { mockMongooseModel } from '../../mock/repository/mongoose.mock';
import { mockUserMongoose } from '../../mock/repository/repository.mock';
import { mockScopesService } from '../../mock/service/service.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { User } from '../../../src/microservice/users/users.schema';
import { GrantScopeUserDTO } from '../../../src/domain/dto/grant-scope-user.dto';
import { JwtService } from '@nestjs/jwt';
import { mockJWTService } from '../../mock/service/jwt-service.mock';

const mockUser = new User();
mockUser.username = 'any_username';
mockUser.password = 'any_password';

describe('UsersService', () => {
    let sut: UsersService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                UsersService,
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

        sut = app.get<UsersService>(UsersService);
    });

    describe('createUser', () => {
        it('should call createUser correctly', async () => {
            const createSpy = sinon.spy(mockUserMongoose, 'createUser');

            await sut.createUser(mockUser);

            sinon.assert.calledOnceWithExactly(createSpy, mockUser);

            createSpy.restore();
        });
    });

    describe('grantscope', () => {
        it('should call grantscope correctly', async () => {
            const mockDTO = new GrantScopeUserDTO();
            mockDTO.username = 'any_username';
            mockDTO.scopes = ['scope1', 'scope2'];

            const getUserStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([mockUser]);

            const updateSpy = sinon.spy(
                mockUserMongoose,
                'updateAddUserScopes'
            );

            await sut.grantScopeForUser(mockDTO);

            sinon.assert.calledOnceWithExactly(updateSpy, 'any_username', [
                'scope1',
                'scope2'
            ]);

            updateSpy.restore();
            getUserStub.restore();
        });

        it('should call grantscope adn thorws an error for user not found', async () => {
            const mockDTO = new GrantScopeUserDTO();
            mockDTO.username = 'any_username';
            mockDTO.scopes = ['scope1', 'scope2'];

            const getUserStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([]);

            const updateSpy = sinon.spy(
                mockUserMongoose,
                'updateAddUserScopes'
            );

            try {
                await sut.grantScopeForUser(mockDTO);
            } catch (err) {
                expect(err.message).to.be.equal('User not found!');
            }

            sinon.assert.notCalled(updateSpy);

            updateSpy.restore();
            getUserStub.restore();
        });
    });

    describe('validateUserByCredentials', () => {
        it('should call validateUserByCredentials correctly', async () => {
            const mockUserDB = new User();
            mockUserDB.password = 'any_password';

            const getUserStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([mockUserDB]);

            const validateStub = sinon.spy(sut, 'validateUserPassword');

            await sut.validateUserByCredentials(mockUser);

            sinon.assert.calledOnceWithExactly(
                validateStub,
                mockUser,
                mockUserDB
            );

            getUserStub.restore();
            validateStub.restore();
        });

        it('should call validateUserByCredentials adn thorws an error for user not found', async () => {
            const getUserStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([]);

            try {
                await sut.validateUserByCredentials(mockUser);
            } catch (err) {
                expect(err.message).to.be.equal('User not found!');
            }

            getUserStub.restore();
        });
    });

    describe('validateScopesForUser', () => {
        it('should call validateScopesForUser correctly and validate the scopes', async () => {
            const getUserStub = sinon
                .stub(mockUserMongoose, 'getScopesByUser')
                .returns(['scope1', 'scope2']);

            await sut.validateScopesForUser('any_user', ['scope1', 'scope2']);

            sinon.assert.calledOnceWithExactly(getUserStub, 'any_user');

            getUserStub.restore();
        });

        it('should call validateScopesForUser adn thorws an error for Forbidden Scope', async () => {
            const getUserStub = sinon
                .stub(mockUserMongoose, 'getScopesByUser')
                .returns(['scope2']);

            try {
                await sut.validateScopesForUser('any_user', [
                    'scope1',
                    'scope2'
                ]);
            } catch (err) {
                expect(err.message).to.be.equal(`Forbidden Scope 'scope1'`);
            }

            getUserStub.restore();
        });
    });
});
