import { mockConfigService } from './../../../../../mock/service/config-service.mock';
import { ConfigService } from '@nestjs/config';
import { UpdatePasswordDTO } from './../../../../../../src/microservice/domain/dto/update-password.dto';
import { mockUserPassword } from './../../../../../mock/model/user.mock';
import { UpdatePasswordService } from './../../../../../../src/microservice/domain/service/users/update-password.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { mockProjectService, mockUserMongoose } from '../../../../../mock';
import { expect } from 'chai';
import { UsersMongoose } from '../../../../../../src/microservice/adapter/repository/users.repository';
import { ProjectService } from '../../../../../../src/microservice/domain/service/project.service';

describe('UpdatePasswordService', () => {
    let sut: UpdatePasswordService;
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                UpdatePasswordService,
                {
                    provide: UsersMongoose,
                    useValue: mockUserMongoose
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                },
                {
                    provide: ProjectService,
                    useValue: mockProjectService
                }
            ]
        }).compile();

        sut = app.get<UpdatePasswordService>(UpdatePasswordService);
    });

    describe('updatePassword', () => {
        it('should call updatePassword', async () => {
            const mockUser = mockUserPassword(
                sut.generateUserHash('any_password')
            );

            const checkStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([mockUser]);

            const updateSpy = sinon.stub(mockUserMongoose, 'updatePassword');

            const mockDto = new UpdatePasswordDTO();
            mockDto.username = mockUser.username;
            mockDto.projectKey = mockUser.projectKey;
            mockDto.actualPassword = 'any_password';
            mockDto.newPassword = 'any_newpass';
            mockDto.confirmPassword = 'any_newpass';

            await sut.updatePassword(mockDto);

            sinon.assert.calledOnce(updateSpy);

            checkStub.restore();
            updateSpy.restore();
        });

        it('should call updatePassword actualValidate false', async () => {
            const mockUser = mockUserPassword(
                sut.generateUserHash('any_password')
            );

            const checkStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([mockUser]);

            const updateSpy = sinon.stub(mockUserMongoose, 'updatePassword');

            const mockDto = new UpdatePasswordDTO();
            mockDto.username = mockUser.username;
            mockDto.projectKey = mockUser.projectKey;
            mockDto.actualPassword = 'any_password';
            mockDto.newPassword = 'any_newpass';
            mockDto.confirmPassword = 'any_newpass';

            await sut.updatePassword(mockDto, false);

            sinon.assert.calledOnce(updateSpy);

            checkStub.restore();
            updateSpy.restore();
        });

        it('should call updatePassword and throws an error for empty pass', async () => {
            const mockUser = mockUserPassword(
                sut.generateUserHash('any_password')
            );

            const checkStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([mockUser]);

            const mockDto = new UpdatePasswordDTO();
            mockDto.username = mockUser.username;
            mockDto.projectKey = mockUser.projectKey;
            mockDto.actualPassword = 'any_password';
            mockDto.newPassword = '';
            mockDto.confirmPassword = 'any_newpass';

            try {
                await sut.updatePassword(mockDto);
            } catch (err) {
                expect(err.message).to.be.equal('Empty Password');
            }

            checkStub.restore();
        });

        it('should call updatePassword and throws an confirm error', async () => {
            const mockUser = mockUserPassword(
                sut.generateUserHash('any_password')
            );

            const checkStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([mockUser]);

            const mockDto = new UpdatePasswordDTO();
            mockDto.username = mockUser.username;
            mockDto.projectKey = mockUser.projectKey;
            mockDto.actualPassword = 'any_password';
            mockDto.newPassword = 'any_newpass1';
            mockDto.confirmPassword = 'any_newpass';

            try {
                await sut.updatePassword(mockDto);
            } catch (err) {
                expect(err.message).to.be.equal(
                    `New password and Confirm password doesn't match!`
                );
            }

            checkStub.restore();
        });

        it('should call updatePassword and throws an error for Invalid actual password!', async () => {
            const mockUser = mockUserPassword(
                sut.generateUserHash('any_password')
            );

            const checkStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([mockUser]);

            const mockDto = new UpdatePasswordDTO();
            mockDto.username = mockUser.username;
            mockDto.projectKey = mockUser.projectKey;
            mockDto.actualPassword = 'any_password1';
            mockDto.newPassword = 'any_newpass';
            mockDto.confirmPassword = 'any_newpass';

            try {
                await sut.updatePassword(mockDto);
            } catch (err) {
                expect(err.message).to.be.equal('Invalid actual password!');
            }

            checkStub.restore();
        });

        it('should call updatePassword and throws an error for equal actual pass', async () => {
            const mockUser = mockUserPassword(
                sut.generateUserHash('any_password')
            );

            const checkStub = sinon
                .stub(mockUserMongoose, 'find')
                .returns([mockUser]);

            const mockDto = new UpdatePasswordDTO();
            mockDto.username = mockUser.username;
            mockDto.projectKey = mockUser.projectKey;
            mockDto.actualPassword = 'any_password';
            mockDto.newPassword = 'any_password';
            mockDto.confirmPassword = 'any_password';

            try {
                await sut.updatePassword(mockDto);
            } catch (err) {
                expect(err.message).to.be.equal(
                    `New password can't be equal actual password!`
                );
            }

            checkStub.restore();
        });
    });
});
