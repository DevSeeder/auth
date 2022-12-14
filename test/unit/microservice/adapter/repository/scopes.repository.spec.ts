import { Test, TestingModule } from '@nestjs/testing';
import { mockMongooseModel } from '../../../../mock/repository/mongoose.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { User } from '../../../../../src/microservice/domain/schema/users.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Scope } from '../../../../../src/microservice/domain/schema/scopes.schema';
import { ScopesMongoose } from '../../../../../src/microservice/adapter/repository/scopes.repository';

const mockUser = new User();
mockUser.username = 'any_username';
mockUser.password = 'any_password';

describe('ScopesMongoose', () => {
    let sut: ScopesMongoose;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                ScopesMongoose,
                {
                    provide: getModelToken(Scope.name),
                    useValue: mockMongooseModel
                }
            ]
        }).compile();

        sut = app.get<ScopesMongoose>(ScopesMongoose);
    });

    describe('find', () => {
        it('should call find correctly', async () => {
            const getUserStub = sinon.stub(sut, 'find').returns([new Scope()]);

            const actual = await sut.find({
                username: 'any_user'
            });

            expect(actual).to.be.deep.equal([new Scope()]);

            getUserStub.restore();
        });
    });

    describe('searchScope', () => {
        it('should call searchScope correctly', async () => {
            const getUserStub = sinon.stub(sut, 'find').returns([new Scope()]);

            const actual = await sut.searchScope(
                'any',
                'any_projectKey',
                'any_resourceKey'
            );

            expect(actual).to.be.deep.equal([new Scope()]);

            getUserStub.restore();
        });

        it('should call searchScope correctly default resourceKey', async () => {
            const getUserStub = sinon.stub(sut, 'find').returns([new Scope()]);

            const actual = await sut.searchScope('any', 'any_projectKey');

            expect(actual).to.be.deep.equal([new Scope()]);

            getUserStub.restore();
        });

        it('should call searchScope correctly default projectKey', async () => {
            const getUserStub = sinon.stub(sut, 'find').returns([new Scope()]);

            const actual = await sut.searchScope('any');

            expect(actual).to.be.deep.equal([new Scope()]);

            getUserStub.restore();
        });

        it('should call searchScope correctly default params', async () => {
            const getUserStub = sinon.stub(sut, 'find').returns([new Scope()]);

            const actual = await sut.searchScope('');

            expect(actual).to.be.deep.equal([new Scope()]);

            getUserStub.restore();
        });
    });
});
