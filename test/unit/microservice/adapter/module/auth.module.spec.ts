import { ProjectsMongoose } from './../../../../../src/microservice/adapter/repository/projects.repository';
import { Project } from './../../../../../src/microservice/domain/schema/projects.schema';
import { JwtAuthGuard } from './../../../../../src/core/jwt/jwt-auth.guard';
import { Scope } from './../../../../../src/microservice/domain/schema/scopes.schema';
import { User } from './../../../../../src/microservice/domain/schema/users.schema';
import {
    mockMongoose,
    mockProjectMongoose,
    mockUserMongoose
} from './../../../../mock/repository/repository.mock';
import { ScopesMongoose } from './../../../../../src/microservice/adapter/repository/scopes.repository';
import { AuthModule } from './../../../../../src/microservice/adapter/module/auth.module';
import { AuthService } from './../../../../../src/microservice/domain/service/auth.service';
import { mockAuthService } from './../../../../mock/service/service.mock';
import { LocalAuthGuard } from './../../../../../src/core/local/local-auth.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '../../../../../src/microservice/adapter/controller/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { mockAuthGuard } from '../../../../mock/guard/guard.mock';
import { mockJWTService } from '../../../../mock/service/jwt-service.mock';
import { mockMongooseModel } from '../../../../mock/repository/mongoose.mock';
import { UsersMongoose } from '../../../../../src/microservice/adapter/repository/users.repository';

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
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: () => {
                            return '';
                        }
                    }
                }
            ]
        })
            .overrideGuard(LocalAuthGuard)
            .useValue(mockAuthGuard)
            .overrideGuard(JwtAuthGuard)
            .useValue(mockAuthGuard)
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .overrideProvider(JwtService)
            .useValue(mockJWTService)
            .overrideProvider(UsersMongoose)
            .useValue(mockUserMongoose)
            .overrideProvider(ScopesMongoose)
            .useValue(mockMongoose)
            .overrideProvider(ProjectsMongoose)
            .useValue(mockProjectMongoose)
            .overrideProvider(getModelToken(User.name))
            .useValue(mockMongooseModel)
            .overrideProvider(getModelToken(Scope.name))
            .useValue(mockMongooseModel)
            .overrideProvider(getModelToken(Project.name))
            .useValue(mockMongooseModel)
            .overrideProvider(ConfigService)
            .useValue({
                get: () => {
                    return '';
                }
            })
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
