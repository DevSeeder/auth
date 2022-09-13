import { GrantScopeUserDTO } from './../../../../../../src/microservice/domain/dto/grant-scope-user.dto';
import { LocalAuthGuard } from './../../../../../../src/core/local/local-auth.guard';
import { mockMongooseModel } from './../../../../../mock/repository/mongoose.mock';
import { UsersMongoose } from './../../../../../../src/microservice/adapter/repository/users.repository';
import { ValidateUserService } from './../../../../../../src/microservice/domain/service/users/validate-user.service';
import { ScopesService } from './../../../../../../src/microservice/domain/service/scopes.service';
import { GrantUserScopesService } from './../../../../../../src/microservice/domain/service/users/grant-user-scopes.service';
import { User } from './../../../../../../src/microservice/domain/schema/users.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { JwtService } from '@nestjs/jwt';
import { mockScopesService } from './../../../../../mock/service/service.mock';
import { mockValidateUserService } from './../../../../../mock/service/user-service.mock';
import { mockUserMongoose } from './../../../../../mock/repository/repository.mock';
import { ScopesMongoose } from './../../../../../../src/microservice/adapter/repository/scopes.repository';
import { mockJWTService } from './../../../../../mock/service/jwt-service.mock';
import { mockAuthGuard } from './../../../../../mock/guard/guard.mock';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from '../../../../../mock/service/config-service.mock';

const mockUser = new User();
mockUser.username = 'any_username';
mockUser.password = 'any_password';
mockUser.projectKey = 'any_projectKey';

describe('GrantUserScopesService', () => {
    let sut: GrantUserScopesService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                GrantUserScopesService,
                {
                    provide: ScopesService,
                    useValue: mockScopesService
                },
                {
                    provide: ValidateUserService,
                    useValue: mockValidateUserService
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
                    provide: ConfigService,
                    useValue: mockConfigService
                }
            ]
        })
            .overrideGuard(LocalAuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        sut = app.get<GrantUserScopesService>(GrantUserScopesService);
    });

    describe('grantscope', () => {
        it('should call grantscope correctly', async () => {
            const mockDTO = new GrantScopeUserDTO();
            mockDTO.username = 'any_username';
            mockDTO.projectKey = 'any_projectKey';
            mockDTO.scopes = ['scope1', 'scope2'];

            mockUser.scopes = [];

            const getUserStub = sinon
                .stub(mockValidateUserService, 'getUserByUsernameAndProject')
                .returns([mockUser]);

            const validateScopeStub = sinon.stub(
                mockScopesService,
                'validateScopes'
            );

            const updateSpy = sinon.spy(
                mockUserMongoose,
                'updateAddUserScopes'
            );

            await sut.grantScopeForUser(mockDTO);

            sinon.assert.calledOnceWithExactly(
                updateSpy,
                'any_username',
                'any_projectKey',
                ['scope1', 'scope2']
            );

            updateSpy.restore();
            validateScopeStub.restore();
            getUserStub.restore();
        });

        it('should call grantscope adn thorws an error for user not found', async () => {
            const mockDTO = new GrantScopeUserDTO();
            mockDTO.username = 'any_username';
            mockDTO.scopes = ['scope1', 'scope2'];

            const getUserStub = sinon
                .stub(mockValidateUserService, 'getUserByUsernameAndProject')
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

    describe('validateScopesForUser', () => {
        it('should call validateScopesForUser correctly and validate the scopes', async () => {
            const getUserStub = sinon
                .stub(mockUserMongoose, 'getScopesByUser')
                .returns(['scope1', 'scope2']);

            await sut.validateScopesForUser('any_user', 'any_projectKey', [
                'scope1',
                'scope2'
            ]);

            sinon.assert.calledOnceWithExactly(
                getUserStub,
                'any_user',
                'any_projectKey'
            );

            getUserStub.restore();
        });

        it('should call validateScopesForUser adn thorws an error for Forbidden Scope', async () => {
            const getUserStub = sinon
                .stub(mockUserMongoose, 'getScopesByUser')
                .returns(['scope2']);

            try {
                await sut.validateScopesForUser('any_user', 'any_projectKey', [
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
