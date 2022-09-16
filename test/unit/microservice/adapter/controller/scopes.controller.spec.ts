import { mockScopesService } from '../../../../mock/service/service.mock';
import { ScopesController } from '../../../../../src/microservice/adapter/controller/scopes.controller';
import { JwtAuthGuard } from '../../../../../src/core/jwt/jwt-auth.guard';
import { mockAuthGuard } from '../../../../mock/guard/guard.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from '../../../../../src/core/local/local-auth.guard';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ScopesService } from '../../../../../src/microservice/domain/service/scopes.service';
import { Scope } from '../../../../../src/microservice/domain/schema/scopes.schema';

describe('ScopesController', () => {
    let sut: ScopesController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [ScopesController],
            providers: [
                {
                    provide: ScopesService,
                    useValue: mockScopesService
                }
            ]
        })
            .overrideGuard(LocalAuthGuard)
            .useValue(mockAuthGuard)
            .overrideGuard(JwtAuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        sut = app.get<ScopesController>(ScopesController);
    });

    describe('searchScope', () => {
        it('should call searchScope and return an array', async () => {
            const searchStub = sinon
                .stub(mockScopesService, 'searchScopes')
                .returns([new Scope()]);

            const actual = await sut.searchScope('any', 'any', 'any');
            expect(JSON.stringify(actual)).to.be.equal(
                JSON.stringify([new Scope()])
            );

            searchStub.restore();
        });
    });

    describe('getScopeByid', () => {
        it('should call getScopeByid and return an object', async () => {
            const searchStub = sinon
                .stub(mockScopesService, 'validateScopeById')
                .returns(new Scope());

            const actual = await sut.getScopeByid('any');
            expect(JSON.stringify(actual)).to.be.equal(
                JSON.stringify(new Scope())
            );

            searchStub.restore();
        });
    });
});
