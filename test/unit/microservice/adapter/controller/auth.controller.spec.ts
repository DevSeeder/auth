import { mockMongooseModel } from './../../../../mock/repository/mongoose.mock';
import { JwtAuthGuard } from './../../../../../src/core/jwt/jwt-auth.guard';
import { mockAuthGuard } from './../../../../mock/guard/guard.mock';
import { mockUserMongoose } from './../../../../mock/repository/repository.mock';
import { AuthController } from './../../../../../src/microservice/adapter/controller/auth.controller';
import { mockValidateUserService } from './../../../../mock/service/user-service.mock';
import {
    mockAuthService,
    mockScopesService
} from './../../../../mock/service/service.mock';
import { AuthService } from './../../../../../src/microservice/domain/service/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidateUserService } from '../../../../../src/microservice/domain/service/users/validate-user.service';
import { ScopesService } from '../../../../../src/microservice/domain/service/scopes.service';
import { UsersMongoose } from '../../../../../src/microservice/adapter/repository/users.repository';
import { ScopesMongoose } from '../../../../../src/microservice/adapter/repository/scopes.repository';
import { LocalAuthGuard } from '../../../../../src/core/local/local-auth.guard';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('AuthController', () => {
    let sut: AuthController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService
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
                }
            ]
        })
            .overrideGuard(LocalAuthGuard)
            .useValue(mockAuthGuard)
            .overrideGuard(JwtAuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        sut = app.get<AuthController>(AuthController);
    });

    const mockRequest = {
        headers: {
            authorization: 'any'
        }
    };

    describe('login', () => {
        it('should call login and return a json with token', async () => {
            const mockResponseToken = {
                token: 'any_token'
            };

            const authServiceStub = sinon
                .stub(mockAuthService, 'loginWithCredentials')
                .returns(mockResponseToken);

            const actual = await sut.login(mockRequest, ['scope1', 'scope2']);
            expect(JSON.stringify(actual)).to.be.equal(
                JSON.stringify(mockResponseToken)
            );

            authServiceStub.restore();
        });
    });
});
