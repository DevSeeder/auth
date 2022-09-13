import { Test, TestingModule } from '@nestjs/testing';
import { UsersMongoose } from '../../../../../src/microservice/adapter/repository/users.repository';
import { mockMongooseModel } from '../../../../mock/repository/mongoose.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { User } from '../../../../../src/microservice/domain/schema/users.schema';
import { getModelToken } from '@nestjs/mongoose';

const mockUser = new User();
mockUser.username = 'any_username';
mockUser.password = 'any_password';
mockUser.projectKey = 'any_projectKey';

describe('UsersMongoose', () => {
    let sut: UsersMongoose;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                UsersMongoose,
                {
                    provide: getModelToken(User.name),
                    useValue: mockMongooseModel
                }
            ]
        }).compile();

        sut = app.get<UsersMongoose>(UsersMongoose);
    });

    describe('createUser', () => {
        it('should call createUser correctly', async () => {
            const createSpy = sinon
                .stub(mockMongooseModel, 'create')
                .yields(null, () => {
                    return;
                });

            await sut.createUser(mockUser);

            sinon.assert.calledOnce(createSpy);

            createSpy.restore();
        });
    });

    describe('updateAddUserScopes', () => {
        it('should call updateAddUserScopes correctly', async () => {
            const updateSpy = sinon.spy(mockMongooseModel, 'updateOne');

            await sut.updateAddUserScopes('any_user', 'any_projectKey', [
                'scope1',
                'scope2'
            ]);

            sinon.assert.calledOnce(updateSpy);

            updateSpy.restore();
        });
    });

    describe('getScopesByUser', () => {
        it('should call getScopesByUser correctly', async () => {
            const mockGetScopes = mockUser;
            mockGetScopes.scopes = ['scope1', 'scope2'];

            const getUserStub = sinon
                .stub(sut, 'find')
                .returns([mockGetScopes]);

            const actual = await sut.getScopesByUser(
                'any_user',
                'any_projectKey'
            );

            expect(actual).to.be.deep.equal(['scope1', 'scope2']);

            getUserStub.restore();
        });

        it('should call getScopesByUser adn thorws an error for user not found', async () => {
            const getUserStub = sinon.stub(sut, 'find').returns([]);

            try {
                await sut.getScopesByUser('any_user', 'any_projectKey');
            } catch (err) {
                expect(err.message).to.be.equal('User not found!');
            }

            getUserStub.restore();
        });
    });
});
