import { Test, TestingModule } from '@nestjs/testing';
import { ScopesMongoose } from '../../../src/microservice/scopes/scope.repository';
import { ScopesService } from '../../../src/microservice/scopes/scopes.service';
import { UsersMongoose } from '../../../src/microservice/users/users.repository';
import { UsersService } from '../../../src/microservice/users/service/users.service';
import { mockMongooseModel } from '../../mock/repository/mongoose.mock';
import { mockUserMongoose } from '../../mock/repository/repository.mock';
import {
    mockScopesService,
    mockUserService
} from '../../mock/service/service.mock';
import { AuthService } from '../../../src/microservice/auth/auth.service';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { mockJWTService } from '../../mock/service/jwt-service.mock';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
    let sut: AuthService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                AuthService,
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
        }).compile();

        sut = app.get<AuthService>(AuthService);
    });

    const mockRequest = {
        headers: {
            authorization: 'any'
        }
    };

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
