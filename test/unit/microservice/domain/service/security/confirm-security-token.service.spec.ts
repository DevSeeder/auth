import { DateHelper } from './../../../../../../src/microservice/adapter/helper/date.helper';
import { SecurityToken } from './../../../../../../src/microservice/domain/schema/security-tokens.schema';
import { ConfirmSecurityTokenService } from './../../../../../../src/microservice/domain/service/security/confirm-security-token.service';
import { EnumTokenType } from '../../../../../../src/microservice/domain/enum/enum-token-type.enum';
import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { mockSecurityTokensMongoose } from '../../../../../mock';
import { SecurityTokensMongoose } from '../../../../../../src/microservice/adapter/repository/security-tokens.repository';
import { expect } from 'chai';

const mockSecToken = new SecurityToken();
mockSecToken.attemps = [];
mockSecToken.expires = '3h';
mockSecToken.expirationDate = new Date('3022-02-12');
mockSecToken['_id'] = 'any';

describe('ConfirmSecurityTokenService', () => {
    let sut: ConfirmSecurityTokenService;
    const mockRepo = mockSecurityTokensMongoose();
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                ConfirmSecurityTokenService,
                {
                    provide: SecurityTokensMongoose,
                    useValue: mockRepo
                }
            ]
        }).compile();

        sut = app.get<ConfirmSecurityTokenService>(ConfirmSecurityTokenService);
    });

    describe('confirmCode', () => {
        it('should call confirmCode call insertOne', async () => {
            const checkStub = sinon
                .stub(mockRepo, 'checkConfirmationCode')
                .returns([mockSecToken]);

            const actual = await sut.confirmCode(
                EnumTokenType.PASSWORD_RECOVERY,
                'any',
                'any_code'
            );

            expect(actual.success).to.be.deep.equal(true);
            expect(actual.response['securityTokenId']).to.be.deep.equal('any');

            checkStub.restore();
        });

        it('should call confirmCode and throws token not found', async () => {
            const checkStub = sinon
                .stub(mockRepo, 'checkConfirmationCode')
                .returns([]);

            try {
                await sut.confirmCode(
                    EnumTokenType.PASSWORD_RECOVERY,
                    'any',
                    'any_code'
                );
            } catch (e) {
                expect(e.message).to.be.deep.equal('Token Not Found');
            }

            checkStub.restore();
        });

        it('should call confirmCode and throws Too many attempts, please generate a new token', async () => {
            const mockActual = mockSecToken;
            mockActual.attemps = [null, null, null, null];

            const checkStub = sinon
                .stub(mockRepo, 'checkConfirmationCode')
                .returns([mockActual]);

            try {
                await sut.confirmCode(
                    EnumTokenType.PASSWORD_RECOVERY,
                    'any',
                    'any_code'
                );
            } catch (e) {
                expect(e.message).to.be.deep.equal(
                    'Too many attempts, please generate a new token'
                );
            }

            checkStub.restore();
        });

        it('should call confirmCode and throws Expired Code', async () => {
            const mockActual = mockSecToken;
            const mockDate = DateHelper.GetDateNow();
            mockDate.setHours(-12);
            mockActual.expirationDate = mockDate;

            const checkStub = sinon
                .stub(mockRepo, 'checkConfirmationCode')
                .returns([mockActual]);

            try {
                await sut.confirmCode(
                    EnumTokenType.PASSWORD_RECOVERY,
                    'any',
                    'any_code'
                );
            } catch (e) {
                expect(e.message).to.be.deep.equal('Expired Code');
            }

            checkStub.restore();
        });

        it('should call confirmCode and throws Invalid Security Token', async () => {
            const checkStub = sinon.stub(mockRepo, 'checkConfirmationCode');

            checkStub.onCall(0).returns([mockSecToken]);
            checkStub.onCall(1).returns([]);

            try {
                await sut.confirmCode(
                    EnumTokenType.PASSWORD_RECOVERY,
                    'any',
                    'any_code'
                );
            } catch (e) {
                expect(e.message).to.be.deep.equal('Invalid Security Token');
            }

            checkStub.restore();
        });
    });
});
