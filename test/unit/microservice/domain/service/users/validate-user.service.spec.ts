import { ProjectService } from './../../../../../../src/microservice/domain/service/project.service';
import { ValidateUserService } from './../../../../../../src/microservice/domain/service/users/validate-user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from '../../../../../../src/core/local/local-auth.guard';
import { UsersMongoose } from '../../../../../../src/microservice/adapter/repository/users.repository';
import { mockAuthGuard } from '../../../../../mock/guard/guard.mock';
import { mockUserMongoose } from '../../../../../mock/repository/repository.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { User } from '../../../../../../src/microservice/domain/schema/users.schema';
import { JwtService } from '@nestjs/jwt';
import { mockJWTService } from '../../../../../mock/service/jwt-service.mock';
import { mockConfigService } from '../../../../../mock/service/config-service.mock';
import { ConfigService } from '@nestjs/config';
import { mockProjectService } from '../../../../../mock';

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
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                },
                {
                    provide: ProjectService,
                    useValue: mockProjectService
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
            mockUserDB.username = 'any_username';
            mockUserDB.password = 'any_password';

            const getUserStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([mockUserDB]);

            const validateStub = sinon.spy(sut, 'validateUserPassword');

            await sut.validateUserByCredentials(mockUser, 'any_projectKey');

            sinon.assert.calledOnceWithExactly(
                validateStub,
                mockUser.password,
                mockUserDB.password
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

    describe('getAndValidateUser', () => {
        it('should call getAndValidateUser adn thorws an error for User inactive!', async () => {
            const getUserStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([new User()]);

            try {
                await sut.getAndValidateUser('any_username', 'any_projectKey');
            } catch (err) {
                expect(err.message).to.be.equal('User inactive!');
            }

            getUserStub.restore();
        });

        it('should call getAndValidateUser adn thorws an error for user not found', async () => {
            const getUserStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([]);

            try {
                await sut.getAndValidateUser('any_username', 'any_projectKey');
            } catch (err) {
                expect(err.message).to.be.equal('User not found');
            }

            getUserStub.restore();
        });
    });

    describe('getById', () => {
        it('should call getById adn thorws an error for user not found', async () => {
            const getUserStub = sinon
                .stub(mockUserMongoose, 'findById')
                .returns(null);

            try {
                await sut.getById('any');
            } catch (err) {
                expect(err.message).to.be.equal('User not found');
            }

            getUserStub.restore();
        });
    });

    describe('getAndValidateUserById', () => {
        it('should call getAndValidateUserById adn thorws an error for User inactive!', async () => {
            const getUserStub = sinon
                .stub(mockUserMongoose, 'findById')
                .returns(new User());

            try {
                await sut.getAndValidateUserById('any');
            } catch (err) {
                expect(err.message).to.be.equal('User inactive!');
            }

            getUserStub.restore();
        });
    });

    describe('searchUser', () => {
        it('should call searchUser and return an array', async () => {
            const getUserStub = sinon
                .stub(mockUserMongoose, 'searchUser')
                .returns([mockUser]);

            const actual = await sut.searchUser(
                'any_username',
                'any_projectKey'
            );

            expect(actual).to.be.deep.equal([mockUser]);

            getUserStub.restore();
        });
    });
});
