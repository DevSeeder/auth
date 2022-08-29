import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from '../../../src/core/local/local-auth.guard';
import { mockAuthGuard } from '../../mock/guard/guard.mock';
import { mockMongooseModel } from '../../mock/repository/mongoose.mock';
import {
    mockMongoose,
    mockUserMongoose
} from '../../mock/repository/repository.mock';
import { mockAuthService } from '../../mock/service/service.mock';
import { AuthController } from '../../../src/microservice/auth/auth.controller';
import { AuthService } from '../../../src/microservice/auth/auth.service';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { AuthModule } from '../../../src/microservice/auth/auth.module';
import { User } from '../../../src/microservice/users/users.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Scope } from '../../../src/microservice/scopes/scopes.schema';
import { UsersMongoose } from '../../../src/microservice/users/users.repository';
import { ScopesMongoose } from '../../../src/microservice/scopes/scope.repository';
import { JwtService } from '@nestjs/jwt';
import { mockJWTService } from '../../mock/service/jwt-service.mock';

describe('AuthModule', () => {
    let sut: AuthController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [AuthModule],
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService
                }
            ]
        })
            .overrideGuard(LocalAuthGuard)
            .useValue(mockAuthGuard)
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .overrideProvider(JwtService)
            .useValue(mockJWTService)
            .overrideProvider(UsersMongoose)
            .useValue(mockUserMongoose)
            .overrideProvider(ScopesMongoose)
            .useValue(mockMongoose)
            .overrideProvider(getModelToken(User.name))
            .useValue(mockMongooseModel)
            .overrideProvider(getModelToken(Scope.name))
            .useValue(mockMongooseModel)
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
