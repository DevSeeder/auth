import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from '../../../../src/core/local/local-auth.guard';
import { UsersMongoose } from '../../../../src/microservice/adapter/repository/users.repository';
import { mockAuthGuard } from '../../../mock/guard/guard.mock';
import { mockUserMongoose } from '../../../mock/repository/repository.mock';
import * as sinon from 'sinon';
import { JwtService } from '@nestjs/jwt';
import { mockJWTService } from '../../../mock/service/jwt-service.mock';
import { CreateUserService } from '../../../../src/microservice/domain/service/users/create-user.service';
import { CreateUserDTO } from '../../../../src/microservice/domain/dto/create-user.dto';
import { ValidateUserService } from '../../../../src/microservice/users/service/validate-user.service';
import { mockValidateUserService } from '../../../mock/service/user-service.mock';
import { expect } from 'chai';

const mockUser = new CreateUserDTO();
mockUser.username = 'any_username';
mockUser.password = 'any_password';
mockUser.projectKey = 'any_project';

describe('CreateUserService', () => {
    let sut: CreateUserService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                CreateUserService,
                {
                    provide: UsersMongoose,
                    useValue: mockUserMongoose
                },
                {
                    provide: JwtService,
                    useValue: mockJWTService
                },
                {
                    provide: ValidateUserService,
                    useValue: mockValidateUserService
                }
            ]
        })
            .overrideGuard(LocalAuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        sut = app.get<CreateUserService>(CreateUserService);
    });

    describe('createUser', () => {
        it('should call createUser correctly', async () => {
            const createSpy = sinon.spy(mockUserMongoose, 'createUser');

            const userStub = sinon
                .stub(mockValidateUserService, 'getUserByUsernameAndProject')
                .returns([]);

            await sut.createUser(mockUser);

            sinon.assert.calledOnce(createSpy);

            createSpy.restore();
            userStub.restore();
        });

        it('should call createUser and thows an error for user exists', async () => {
            const createSpy = sinon.spy(mockUserMongoose, 'createUser');

            const userStub = sinon
                .stub(mockValidateUserService, 'getUserByUsernameAndProject')
                .returns([null]);

            try {
                await sut.createUser(mockUser);
            } catch (err) {
                expect(err.message).to.be.equal(
                    'User any_username already exists for this project'
                );
            }

            createSpy.restore();
            userStub.restore();
        });
    });
});
