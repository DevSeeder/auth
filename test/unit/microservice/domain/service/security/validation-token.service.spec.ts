import { ValidationTokenService } from './../../../../../../src/microservice/domain/service/security/validation-token.service';
import { SecurityToken } from '../../../../../../src/microservice/domain/schema/security-tokens.schema';
import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { mockSecurityTokensMongoose } from '../../../../../mock';
import { SecurityTokensMongoose } from '../../../../../../src/microservice/adapter/repository/security-tokens.repository';
import { expect } from 'chai';

const mockSecToken = new SecurityToken();
mockSecToken.attemps = [];
mockSecToken.expires = '3h';
mockSecToken.validated = false;
mockSecToken.userId = 'any_userId';
mockSecToken.validationToken = 'any_code';
mockSecToken.expDateValidationToken = new Date('3022-02-12');
mockSecToken['_id'] = 'any';

describe('ValidationTokenService', () => {
    let sut: ValidationTokenService;
    const mockRepo = mockSecurityTokensMongoose();
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                ValidationTokenService,
                {
                    provide: SecurityTokensMongoose,
                    useValue: mockRepo
                }
            ]
        }).compile();

        sut = app.get<ValidationTokenService>(ValidationTokenService);
    });

    describe('checkValidationToken', () => {
        it('should call checkValidationToken', async () => {
            const checkStub = sinon
                .stub(mockRepo, 'findById')
                .returns(mockSecToken);

            const actual = await sut.checkValidationToken('any', 'any_code');

            expect(actual).to.be.deep.equal('any_userId');

            checkStub.restore();
        });

        it('should call checkValidationToken throws token not found', async () => {
            const checkStub = sinon.stub(mockRepo, 'findById').returns(null);

            try {
                await sut.checkValidationToken('any', 'any_code');
            } catch (e) {
                expect(e.message).to.be.deep.equal('Token Not Found');
            }

            checkStub.restore();
        });

        it('should call confirmCode and throws Token Already Validated', async () => {
            const mockActual = mockSecToken;
            mockActual.validated = true;

            const checkStub = sinon
                .stub(mockRepo, 'findById')
                .returns(mockActual);

            try {
                await sut.checkValidationToken('any', 'any_code');
            } catch (e) {
                expect(e.message).to.be.deep.equal('Token Already Validated');
            }

            checkStub.restore();
        });

        it('should call confirmCode and throws Expired Code', async () => {
            const mockActual = mockSecToken;
            mockActual.validated = false;
            mockActual.expDateValidationToken = new Date('2021-02-12');

            const checkStub = sinon
                .stub(mockRepo, 'findById')
                .returns(mockActual);

            try {
                await sut.checkValidationToken('any', 'any_code');
            } catch (e) {
                expect(e.message).to.be.deep.equal('Expired Validation Token');
            }

            checkStub.restore();
        });

        it('should call confirmCode and throws Invalid Validation Token', async () => {
            const mockActual = mockSecToken;
            mockActual.validated = false;

            const checkStub = sinon
                .stub(mockRepo, 'findById')
                .returns(mockActual);

            try {
                await sut.checkValidationToken('any', 'any_code1');
            } catch (e) {
                expect(e.message).to.be.deep.equal('Invalid Validation Token');
            }

            checkStub.restore();
        });
    });
});
