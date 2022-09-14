import {
    ForgotPasswordConfirmDTO,
    ForgotPasswordDTO
} from './../../../../../src/microservice/domain/dto/forgot-password.dto';
import {
    UpdatePasswordCodeDTO,
    UpdatePasswordDTO
} from './../../../../../src/microservice/domain/dto/update-password.dto';
import { mockPasswordRecoveryService } from './../../../../mock/service/security-service.mock';
import { mockUpdatePasswordService } from './../../../../mock/service/user-service.mock';
import { PasswordRecoveryService } from './../../../../../src/microservice/domain/service/security/password-recovery.service';
import { UpdatePasswordService } from './../../../../../src/microservice/domain/service/users/update-password.service';
import { SecurityController } from './../../../../../src/microservice/adapter/controller/security.controller';
import { mockMongooseModel } from '../../../../mock/repository/mongoose.mock';
import { JwtAuthGuard } from '../../../../../src/core/jwt/jwt-auth.guard';
import { mockAuthGuard } from '../../../../mock/guard/guard.mock';
import { mockUserMongoose } from '../../../../mock/repository/repository.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersMongoose } from '../../../../../src/microservice/adapter/repository/users.repository';
import { ScopesMongoose } from '../../../../../src/microservice/adapter/repository/scopes.repository';
import { LocalAuthGuard } from '../../../../../src/core/local/local-auth.guard';
import * as sinon from 'sinon';

describe('SecurityController', () => {
    let sut: SecurityController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [SecurityController],
            providers: [
                {
                    provide: UpdatePasswordService,
                    useValue: mockUpdatePasswordService
                },
                {
                    provide: PasswordRecoveryService,
                    useValue: mockPasswordRecoveryService
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

        sut = app.get<SecurityController>(SecurityController);
    });

    describe('updatePassword', () => {
        it('should call updatePassword and return and call updatePassword', async () => {
            const securitySpy = sinon.spy(
                mockUpdatePasswordService,
                'updatePassword'
            );

            await sut.updatePassword(new UpdatePasswordDTO());

            sinon.assert.calledOnce(securitySpy);

            securitySpy.restore();
        });
    });

    describe('forgetPassword', () => {
        it('should call forgetPassword and return and call generatePasswordRecoveryToken', async () => {
            const securitySpy = sinon.spy(
                mockPasswordRecoveryService,
                'generatePasswordRecoveryToken'
            );

            const mockDto = new ForgotPasswordDTO();
            mockDto.username = 'any_username';
            mockDto.projectKey = 'any_projectKey';

            await sut.forgetPassword(mockDto);

            sinon.assert.calledOnce(securitySpy);

            securitySpy.restore();
        });
    });

    describe('confirmCodeForgotPassword', () => {
        it('should call confirmCodeForgotPassword and return and call confirmPassCode', async () => {
            const securitySpy = sinon.spy(
                mockPasswordRecoveryService,
                'confirmPassCode'
            );

            const mockDto = new ForgotPasswordConfirmDTO();
            mockDto.username = 'any_username';
            mockDto.projectKey = 'any_projectKey';
            mockDto.code = 'any_code';

            await sut.confirmCodeForgotPassword(mockDto);

            sinon.assert.calledOnce(securitySpy);

            securitySpy.restore();
        });
    });

    describe('updateForgotPassword', () => {
        it('should call updateForgotPassword and return and call updateRecoverPassword', async () => {
            const securitySpy = sinon.spy(
                mockPasswordRecoveryService,
                'updateRecoverPassword'
            );

            const mockDto = new UpdatePasswordCodeDTO();
            mockDto.username = 'any_username';
            mockDto.projectKey = 'any_projectKey';

            await sut.updateForgotPassword(mockDto);

            sinon.assert.calledOnce(securitySpy);

            securitySpy.restore();
        });
    });
});
