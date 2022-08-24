import { Test, TestingModule } from '@nestjs/testing';
import { UsersMongoose } from '../../../src/users/users.repository';
import { mockMongooseModel } from '../../mock/repository/mongoose.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { User } from '../../../src/users/users.schema';
import { getModelToken } from '@nestjs/mongoose';

const mockUser = new User();
mockUser.username = 'any_username';
mockUser.password = 'any_password';

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
            const updateSpy = sinon.spy(sut, 'updateOne');

            await sut.updateAddUserScopes('any_user', ['scope1', 'scope2']);

            sinon.assert.calledOnceWithExactly(
                updateSpy,
                {
                    username: 'any_user'
                },
                {
                    $push: {
                        scopes: { $each: ['scope1', 'scope2'] }
                    }
                }
            );

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

            const actual = await sut.getScopesByUser('any_user');

            expect(actual).to.be.deep.equal(['scope1', 'scope2']);

            getUserStub.restore();
        });

        it('should call getScopesByUser adn thorws an error for user not found', async () => {
            const getUserStub = sinon.stub(sut, 'find').returns([]);

            try {
                await sut.getScopesByUser('any_user');
            } catch (err) {
                expect(err.message).to.be.equal('User not found!');
            }

            getUserStub.restore();
        });
    });
});
