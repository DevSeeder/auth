import { Test, TestingModule } from '@nestjs/testing';
import { ScopesMongoose } from '../../../src/scopes/scope.repository';
import { ScopesService } from '../../../src/scopes/scopes.service';
import { UsersMongoose } from '../../../src/users/users.repository';
import { UsersService } from '../../../src/users/users.service';
import { mockMongooseModel } from '../../mock/repository/mongoose.mock';
import { mockUserMongoose } from '../../mock/repository/repository.mock';
import { mockUserService } from '../../mock/service/service.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { mockJWTService } from '../../mock/service/jwt-service.mock';
import { JwtService } from '@nestjs/jwt';
import { Scope } from '../../../src/scopes/scopes.schema';

describe('ScopesService', () => {
    let sut: ScopesService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                ScopesService,
                {
                    provide: UsersService,
                    useValue: mockUserService
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
