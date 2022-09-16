import { mockScopesMongoose } from './../../../../mock/repository/repository.mock';
import { ProjectService } from './../../../../../src/microservice/domain/service/project.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ScopesMongoose } from '../../../../../src/microservice/adapter/repository/scopes.repository';
import { ScopesService } from '../../../../../src/microservice/domain/service/scopes.service';
import { UsersMongoose } from '../../../../../src/microservice/adapter/repository/users.repository';
import { mockUserMongoose } from '../../../../mock/repository/repository.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { mockJWTService } from '../../../../mock/service/jwt-service.mock';
import { JwtService } from '@nestjs/jwt';
import { Scope } from '../../../../../src/microservice/domain/schema/scopes.schema';
import { mockGrantUserScopesService } from '../../../../mock/service/user-service.mock';
import { GrantUserScopesService } from '../../../../../src/microservice/domain/service/users/grant-user-scopes.service';
import { mockProjectService } from '../../../../mock';

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
                    useValue: mockScopesMongoose
                },
                {
                    provide: JwtService,
                    useValue: mockJWTService
                },
                {
                    provide: ProjectService,
                    useValue: mockProjectService
                }
            ]
        }).compile();

        sut = app.get<ScopesService>(ScopesService);
    });

    describe('validateScopes', () => {
        it('should call validateScopes and do not throws errors', async () => {
            const getStub = sinon
                .stub(mockScopesMongoose, 'find')
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
            const getStub = sinon.stub(mockScopesMongoose, 'find').returns([]);

            try {
                await sut.validateScopes(['scope1', 'scope2']);
            } catch (err) {
                expect(err.message).to.be.equal(`Scope 'scope1' is invalid!`);
            }

            getStub.restore();
        });
    });

    describe('searchScopes', () => {
        it('should call searchScopes and do not throws errors', async () => {
            const getStub = sinon
                .stub(mockScopesMongoose, 'searchScope')
                .returns([new Scope()]);

            await sut.searchScopes('any', 'any_projectKey', 'any_resourceKey');

            sinon.assert.calledOnce(getStub);

            getStub.restore();
        });

        it('should call searchScopes default params', async () => {
            const getStub = sinon
                .stub(mockScopesMongoose, 'searchScope')
                .returns([new Scope()]);

            await sut.searchScopes();

            sinon.assert.calledOnce(getStub);

            getStub.restore();
        });
    });
});
