import { GLOBAL_PROJECT_KEY } from './../../../../../src/microservice/domain/constants/project.const';
import { Project } from './../../../../../src/microservice/domain/schema/projects.schema';
import { mockProjectMongoose } from './../../../../mock/repository/repository.mock';
import { ProjectsMongoose } from './../../../../../src/microservice/adapter/repository/projects.repository';
import { ProjectService } from '../../../../../src/microservice/domain/service/project.service';
import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('ProjectService', () => {
    let sut: ProjectService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                ProjectService,
                {
                    provide: ProjectsMongoose,
                    useValue: mockProjectMongoose
                }
            ]
        }).compile();

        sut = app.get<ProjectService>(ProjectService);
    });

    describe('searchProject', () => {
        it('should call searchProject and do not throws errors', async () => {
            const getStub = sinon
                .stub(mockProjectMongoose, 'searchProject')
                .returns([new Project()]);

            await sut.searchProject('any');

            sinon.assert.calledOnce(getStub);

            getStub.restore();
        });
    });

    describe('getProjectByKey', () => {
        it('should call getProjectByKey and do not throws errors', async () => {
            const getStub = sinon
                .stub(mockProjectMongoose, 'getProjectByKey')
                .returns(new Project());

            await sut.getProjectByKey('any');

            sinon.assert.calledOnce(getStub);

            getStub.restore();
        });
    });

    describe('validateProjectByKey', () => {
        it('should call validateProjectByKey and do not throws errors', async () => {
            const getStub = sinon
                .stub(sut, 'getProjectByKey')
                .returns(new Project());

            await sut.validateProjectByKey('any');

            sinon.assert.calledOnce(getStub);

            getStub.restore();
        });

        it('should call validateProjectByKey and return true', async () => {
            const actual = await sut.validateProjectByKey(GLOBAL_PROJECT_KEY);
            expect(actual).to.be.equal(true);
        });

        it('should call validateProjectByKey and throws an error', async () => {
            const getStub = sinon.stub(sut, 'getProjectByKey').returns(null);

            try {
                await sut.validateProjectByKey('any_projectKey');
            } catch (err) {
                expect(err.message).to.be.equal(
                    `Project 'any_projectKey' is invalid!`
                );
            }

            getStub.restore();
        });
    });
});
