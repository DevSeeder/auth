import { Project } from './../../../../../src/microservice/domain/schema/projects.schema';
import { ProjectsMongoose } from './../../../../../src/microservice/adapter/repository/projects.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { mockMongooseModel } from '../../../../mock/repository/mongoose.mock';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { getModelToken } from '@nestjs/mongoose';

const mockProj = new Project();
mockProj.name = 'any_name';

describe('ProjectsMongoose', () => {
    let sut: ProjectsMongoose;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                ProjectsMongoose,
                {
                    provide: getModelToken(Project.name),
                    useValue: mockMongooseModel
                }
            ]
        }).compile();

        sut = app.get<ProjectsMongoose>(ProjectsMongoose);
    });

    describe('searchProject', () => {
        it('should call searchProject correctly', async () => {
            const getUserStub = sinon.stub(sut, 'find').returns([mockProj]);

            const actual = await sut.searchProject('any');

            expect(actual).to.be.deep.equal([mockProj]);

            getUserStub.restore();
        });
    });

    describe('getProjectByKey', () => {
        it('should call getProjectByKey correctly', async () => {
            const getUserStub = sinon.stub(sut, 'findOne').returns([mockProj]);

            const actual = await sut.getProjectByKey('any');

            expect(actual).to.be.deep.equal([mockProj]);

            getUserStub.restore();
        });
    });
});
