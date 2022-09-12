import { Test, TestingModule } from '@nestjs/testing';
import { ScopesMongoose } from '../../../src/microservice/adapter/repository/scopes.repository';
import { ScopesService } from '../../../src/microservice/domain/service/scopes.service';
import { UsersMongoose } from '../../../src/microservice/adapter/repository/users.repository';
import { GrantUserScopesService } from '../../../src/microservice/users/service/grant-user-scopes.service';
import { mockMongooseModel } from '../../mock/repository/mongoose.mock';
import { mockUserMongoose } from '../../mock/repository/repository.mock';
import { mockScopesService } from '../../mock/service/service.mock';
import { AuthService } from '../../../src/microservice/domain/service/auth.service';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { mockJWTService } from '../../mock/service/jwt-service.mock';
import { JwtService } from '@nestjs/jwt';
import { mockGrantUserScopesService } from '../../mock/service/user-service.mock';

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

            const actual = await sut.loginWithCredentials('any', [
                'scope1',
                'scope2'
            ]);
            expect(JSON.stringify(actual)).to.be.equal(
                JSON.stringify(mockResponseToken)
            );

            authServiceStub.restore();
        });
    });
});
