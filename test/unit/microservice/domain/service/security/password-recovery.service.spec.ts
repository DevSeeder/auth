import { UpdatePasswordCodeDTO } from '../../../../../../src/microservice/domain/dto/update-password.dto';
import { EnumTokenType } from '../../../../../../src/microservice/domain/enum/enum-token-type.enum';

import { UpdatePasswordService } from '../../../../../../src/microservice/domain/service/users/update-password.service';
import { ValidateUserService } from '../../../../../../src/microservice/domain/service/users/validate-user.service';
import { ValidationTokenService } from '../../../../../../src/microservice/domain/service/security/validation-token.service';
import { ConfirmSecurityTokenService } from '../../../../../../src/microservice/domain/service/security/confirm-security-token.service';
import { PasswordRecoveryService } from '../../../../../../src/microservice/domain/service/security/password-recovery.service';
import { MailService } from '../../../../../../src/microservice/domain/service/mail/mail.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { expect } from 'chai';
import {
    mockConfirmSecurityTokenService,
    mockGenerateSecurityTokenService,
    mockMailService,
    mockUpdatePasswordService,
    mockUser,
    mockValidateUserService,
    mockValidationTokenService
} from '../../../../../mock';
import { GenerateSecurityTokenService } from '../../../../../../src/microservice/domain/service/security/generate-security-token.service';

describe('PasswordRecoveryService', () => {
    let sut: PasswordRecoveryService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                PasswordRecoveryService,
                {
                    provide: MailService,
                    useValue: mockMailService
                },
                {
                    provide: GenerateSecurityTokenService,
                    useValue: mockGenerateSecurityTokenService
                },
                {
                    provide: ConfirmSecurityTokenService,
                    useValue: mockConfirmSecurityTokenService
                },
                {
                    provide: ValidationTokenService,
                    useValue: mockValidationTokenService
                },
                {
                    provide: ValidateUserService,
                    useValue: mockValidateUserService
                },
                {
                    provide: UpdatePasswordService,
                    useValue: mockUpdatePasswordService
                }
            ]
        }).compile();

        sut = app.get<PasswordRecoveryService>(PasswordRecoveryService);
    });

    describe('generatePasswordRecoveryToken', () => {
        it('should call generatePasswordRecoveryToken and return a json success true', async () => {
            const userStub = sinon
                .stub(mockValidateUserService, 'getAndValidateUser')
                .returns(mockUser());
            const actual = await sut.generatePasswordRecoveryToken(
                'any_username',
                'any_projectKey'
            );

            expect(actual).to.be.deep.equal({
                success: true,
                response: 'Recovery Code sent to email!'
            });
            userStub.restore();
        });
    });

    describe('confirmPassCode', () => {
        it('should call confirmPassCode and return a json success true', async () => {
            const userStub = sinon
                .stub(mockValidateUserService, 'getAndValidateUser')
                .returns(mockUser());

            const confirmSpy = sinon.spy(
                mockConfirmSecurityTokenService,
                'confirmCode'
            );

            await sut.confirmPassCode(
                'any_username',
                'any_projectKey',
                'any_code'
            );

            sinon.assert.calledOnceWithExactly(
                confirmSpy,
                EnumTokenType.PASSWORD_RECOVERY,
                1,
                'any_code'
            );

            confirmSpy.restore();
            userStub.restore();
        });
    });

    describe('generatePasswordRecoveryToken', () => {
        it('should call generatePasswordRecoveryToken and return a json success true', async () => {
            const checkSpy = sinon.spy(
                mockValidationTokenService,
                'checkValidationToken'
            );

            const updateSpy = sinon.spy(
                mockUpdatePasswordService,
                'updatePassword'
            );

            const mockDTO = new UpdatePasswordCodeDTO();
            mockDTO.actualPassword = '';
            mockDTO.newPassword = 'any_password';
            mockDTO.confirmPassword = 'any_password';
            mockDTO.username = 'any_username';
            mockDTO.projectKey = 'any_projectKey';
            mockDTO.validationCode = 'any_validationCode';
            mockDTO.validationTokenId = 'any_validationTokenId';

            const actual = await sut.updateRecoverPassword(mockDTO);

            sinon.assert.calledOnce(checkSpy);
            sinon.assert.calledOnce(updateSpy);

            expect(actual).to.be.deep.equal({
                success: true,
                response: 'Password successfully updated!'
            });

            checkSpy.restore();
            updateSpy.restore();
        });
    });
});
