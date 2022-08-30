import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from '../../../../src/core/local/local-auth.guard';
import { UsersMongoose } from '../../../../src/microservice/users/users.repository';
import { GrantUserScopesService } from '../../../../src/microservice/users/service/grant-user-scopes.service';
import { mockAuthGuard } from '../../../mock/guard/guard.mock';
import { mockUserMongoose } from '../../../mock/repository/repository.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { User } from '../../../../src/microservice/users/users.schema';
import { JwtService } from '@nestjs/jwt';
import { mockJWTService } from '../../../mock/service/jwt-service.mock';
import { ValidateUserService } from '../../../../src/microservice/users/service/validate-user.service';

const mockUser = new User();
mockUser.username = 'any_username';
mockUser.password = 'any_password';

describe('ValidateUserService', () => {
    let sut: ValidateUserService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                ValidateUserService,
                {
                    provide: UsersMongoose,
                    useValue: mockUserMongoose
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

        sut = app.get<ValidateUserService>(ValidateUserService);
    });

    describe('validateUserByCredentials', () => {
        it('should call validateUserByCredentials correctly', async () => {
            const mockUserDB = new User();
            mockUserDB.password = 'any_password';
            mockUserDB.projectKey = 'any_projectKey';

            const getUserStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([mockUserDB]);

            const validateStub = sinon.spy(sut, 'validateUserPassword');

            await sut.validateUserByCredentials(mockUser, 'any_projectKey');

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
                await sut.validateUserByCredentials(mockUser, 'any_projectKey');
            } catch (err) {
                expect(err.message).to.be.equal('User not found!');
            }

            getUserStub.restore();
        });
    });
});
