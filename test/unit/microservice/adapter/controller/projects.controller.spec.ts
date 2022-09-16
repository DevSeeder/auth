import { ProjectController } from '../../../../../src/microservice/adapter/controller/project.controller';
import { Project } from '../../../../../src/microservice/domain/schema/projects.schema';
import { ProjectService } from '../../../../../src/microservice/domain/service/project.service';
import { JwtAuthGuard } from '../../../../../src/core/jwt/jwt-auth.guard';
import { mockAuthGuard } from '../../../../mock/guard/guard.mock';
import { mockProjectService } from '../../../../mock/service/service.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from '../../../../../src/core/local/local-auth.guard';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('ProjectController', () => {
    let sut: ProjectController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [ProjectController],
            providers: [
                {
                    provide: ProjectService,
                    useValue: mockProjectService
                }
            ]
        })
            .overrideGuard(LocalAuthGuard)
            .useValue(mockAuthGuard)
            .overrideGuard(JwtAuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        sut = app.get<ProjectController>(ProjectController);
    });

    describe('searchProject', () => {
        it('should call searchProject and return an array', async () => {
            const searchStub = sinon
                .stub(mockProjectService, 'searchProject')
                .returns([new Project()]);

            const actual = await sut.searchProject('any');
            expect(JSON.stringify(actual)).to.be.equal(
                JSON.stringify([new Project()])
            );

            searchStub.restore();
        });
    });

    describe('getProjectByKey', () => {
        it('should call getProjectByKey and return an object', async () => {
            const searchStub = sinon
                .stub(mockProjectService, 'getProjectByKey')
                .returns(new Project());

            const actual = await sut.getProjectByKey('any');
            expect(JSON.stringify(actual)).to.be.equal(
                JSON.stringify(new Project())
            );

            searchStub.restore();
        });
    });
});
