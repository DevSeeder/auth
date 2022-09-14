import { mockMongooseModel } from './../../../../mock/repository/mongoose.mock';
import { UsersMongoose } from './../../../../../src/microservice/adapter/repository/users.repository';
import { mockUserMongoose } from './../../../../mock/repository/repository.mock';
import { mockScopesService } from './../../../../mock/service/service.mock';
import { ScopesService } from './../../../../../src/microservice/domain/service/scopes.service';
import { GrantUserScopesService } from './../../../../../src/microservice/domain/service/users/grant-user-scopes.service';
import { AuthService } from './../../../../../src/microservice/domain/service/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { JwtService } from '@nestjs/jwt';
import { mockGrantUserScopesService } from './../../../../mock/service/user-service.mock';
import { mockJWTService } from './../../../../mock/service/jwt-service.mock';
import { ScopesMongoose } from './../../../../../src/microservice/adapter/repository/scopes.repository';

describe('AuthService', () => {
    let sut: AuthService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                AuthService,
                {
                    provide: GrantUserScopesService,
                    useValue: mockGrantUserScopesService
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
        }).compile();

        sut = app.get<AuthService>(AuthService);
    });

    describe('loginWithCredentials', () => {
        it('should call loginWithCredentials and return a JSON token', async () => {
            const mockResponseToken = {
                token: 'any_token'
            };

            const authServiceStub = sinon
                .stub(mockJWTService, 'sign')
                .returns('any_token');

            const actual = await sut.loginWithCredentials(
                'any',
                'any_projectKey',
                ['scope1', 'scope2']
            );
            expect(JSON.stringify(actual)).to.be.equal(
                JSON.stringify(mockResponseToken)
            );

            authServiceStub.restore();
        });
    });
});