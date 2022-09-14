import { DateHelper } from './../../../../../src/microservice/adapter/helper/date.helper';
import {
    AttemptSecurityToken,
    SecurityToken
} from './../../../../../src/microservice/domain/schema/security-tokens.schema';
import { EnumTokenType } from './../../../../../src/microservice/domain/enum/enum-token-type.enum';
import { SecurityTokensMongoose } from './../../../../../src/microservice/adapter/repository/security-tokens.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { mockMongooseModel } from '../../../../mock/repository/mongoose.mock';
import * as sinon from 'sinon';
import { User } from '../../../../../src/microservice/domain/schema/users.schema';
import { getModelToken } from '@nestjs/mongoose';

const mockUser = new User();
mockUser.username = 'any_username';
mockUser.password = 'any_password';

describe('SecurityTokensMongoose', () => {
    let sut: SecurityTokensMongoose;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                SecurityTokensMongoose,
                {
                    provide: getModelToken(SecurityToken.name),
                    useValue: mockMongooseModel
                }
            ]
        }).compile();

        sut = app.get<SecurityTokensMongoose>(SecurityTokensMongoose);
    });

    describe('inactiveActualTokens', () => {
        it('should call inactiveActualTokens and call updateOne correctly', async () => {
            const updateSpy = sinon.spy(mockMongooseModel, 'updateOne');

            await sut.inactiveActualTokens(
                EnumTokenType.PASSWORD_RECOVERY,
                'any'
            );

            sinon.assert.calledOnce(updateSpy);

            updateSpy.restore();
        });

        it('should call inactiveActualTokens correctly and call updateOne validated true', async () => {
            const updateSpy = sinon.spy(mockMongooseModel, 'updateOne');

            await sut.inactiveActualTokens(
                EnumTokenType.PASSWORD_RECOVERY,
                'any',
                true
            );

            sinon.assert.calledOnce(updateSpy);

            updateSpy.restore();
        });
    });

    describe('checkConfirmationCode', () => {
        it('should call checkConfirmationCode and call find correctly', async () => {
            const findSpy = sinon.spy(mockMongooseModel, 'find');

            await sut.checkConfirmationCode(
                'any',
                EnumTokenType.PASSWORD_RECOVERY,
                'any_code'
            );

            sinon.assert.calledOnceWithExactly(findSpy, {
                userId: 'any',
                active: true,
                tokenType: EnumTokenType.PASSWORD_RECOVERY,
                token: 'any_code'
            });

            findSpy.restore();
        });

        it('should call checkConfirmationCode and call find correctly without code', async () => {
            const findSpy = sinon.spy(mockMongooseModel, 'find');

            await sut.checkConfirmationCode(
                'any',
                EnumTokenType.PASSWORD_RECOVERY
            );

            sinon.assert.calledOnceWithExactly(findSpy, {
                userId: 'any',
                active: true,
                tokenType: EnumTokenType.PASSWORD_RECOVERY
            });

            findSpy.restore();
        });
    });

    describe('updateConfirmToken', () => {
        it('should call updateConfirmToken and call findByIdAndUpdate correctly', async () => {
            const updateSpy = sinon.spy(mockMongooseModel, 'findByIdAndUpdate');

            await sut.updateConfirmToken(
                'any',
                'any_validation_token',
                DateHelper.GetDateNow()
            );

            sinon.assert.calledOnce(updateSpy);

            updateSpy.restore();
        });
    });

    describe('pushLogAttempt', () => {
        it('should call pushLogAttempt and call findByIdAndUpdate correctly', async () => {
            const updateSpy = sinon.spy(mockMongooseModel, 'findByIdAndUpdate');

            const mockAtt = new AttemptSecurityToken();

            await sut.pushLogAttempt('any', mockAtt);

            sinon.assert.calledOnceWithExactly(updateSpy, 'any', {
                $push: {
                    attemps: mockAtt
                }
            });

            updateSpy.restore();
        });
    });
});
