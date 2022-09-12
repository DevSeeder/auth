import { Test, TestingModule } from '@nestjs/testing';
import { ScopesMongoose } from '../../../src/microservice/adapter/repository/scopes.repository';
import { ScopesService } from '../../../src/microservice/domain/service/scopes.service';
import { UsersMongoose } from '../../../src/microservice/adapter/repository/users.repository';
import { GrantUserScopesService } from '../../../src/microservice/users/service/grant-user-scopes.service';
import { mockMongooseModel } from '../../mock/repository/mongoose.mock';
import { mockUserMongoose } from '../../mock/repository/repository.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { mockJWTService } from '../../mock/service/jwt-service.mock';
import { JwtService } from '@nestjs/jwt';
import { Scope } from '../../../src/microservice/domain/schema/scopes.schema';
import { mockGrantUserScopesService } from '../../mock/service/user-service.mock';

describe('ScopesService', () => {
    let sut: ScopesService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                ScopesService,
                {
                    provide: GrantUserScopesService,
                    useValue: mockGrantUserScopesService
                },
                {
                    provide: UsersMongoose,
                    useValue: mockUserMongoose
                },
                {
                    provide: ScopesMongoose,
                    useValue: mockMongooseModel
                },
                {
                    provide: JwtService,
                    useValue: mockJWTService
                }
            ]
        }).compile();

        sut = app.get<ScopesService>(ScopesService);
    });

    describe('validateScopes', () => {
        it('should call validateScopes and do not throws errors', async () => {
            const getStub = sinon
                .stub(mockMongooseModel, 'find')
                .returns([new Scope()]);

            await sut.validateScopes(['scope1', 'scope2']);

            sinon.assert.calledTwice(getStub);

            getStub.restore();
        });

        it('should call validateScopes and throws error for empty scopes', async () => {
            try {
                await sut.validateScopes([]);
            } catch (err) {
                expect(err.message).to.be.equal('Empty Scopes');
            }
        });

        it('should call validateScopes and throws error for invalid scope', async () => {
            const getStub = sinon.stub(mockMongooseModel, 'find').returns([]);

            try {
                await sut.validateScopes(['scope1', 'scope2']);
            } catch (err) {
                expect(err.message).to.be.equal(`Scope 'scope1' is invalid!`);
            }

            getStub.restore();
        });
    });
});
