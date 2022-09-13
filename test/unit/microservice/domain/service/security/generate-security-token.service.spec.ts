import { EnumCodeType } from './../../../../../../src/microservice/domain/enum/enum-code-type.enum';
import { EnumTokenType } from './../../../../../../src/microservice/domain/enum/enum-token-type.enum';
import { ValidateUserService } from '../../../../../../src/microservice/domain/service/users/validate-user.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import {
    mockSecurityTokensMongoose,
    mockValidateUserService
} from '../../../../../mock';
import { GenerateSecurityTokenService } from '../../../../../../src/microservice/domain/service/security/generate-security-token.service';
import { SecurityTokensMongoose } from '../../../../../../src/microservice/adapter/repository/security-tokens.repository';

describe('GenerateSecurityTokenService', () => {
    let sut: GenerateSecurityTokenService;
    const mockRepo = mockSecurityTokensMongoose();
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                GenerateSecurityTokenService,
                {
                    provide: SecurityTokensMongoose,
                    useValue: mockRepo
                },
                {
                    provide: ValidateUserService,
                    useValue: mockValidateUserService
                }
            ]
        }).compile();

        sut = app.get<GenerateSecurityTokenService>(
            GenerateSecurityTokenService
        );
    });

    describe('generateSecurityToken', () => {
        it('should call generateSecurityToken call insertOne', async () => {
            const insertSpy = sinon.spy(mockRepo, 'insertOne');

            await sut.generateSecurityToken(
                EnumTokenType.PASSWORD_RECOVERY,
                'any',
                EnumCodeType.NUMBER,
                6,
                '3h'
            );

            sinon.assert.calledOnce(insertSpy);

            insertSpy.restore();
        });
    });
});
