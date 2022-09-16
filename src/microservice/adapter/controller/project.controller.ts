import { EnumAuthScopes } from './../../domain/enum/enum-auth-scopes.enum';
import { JwtAuthGuard } from './../../../core/jwt/jwt-auth.guard';
import { ProjectService } from './../../domain/service/project.service';
import { Controller, UseGuards, Param, Get } from '@nestjs/common';
import { Scopes } from '@devseeder/nestjs-microservices-core';

@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.GET_PROJECT)
    @Get('/search/:key')
    async searchProject(@Param('key') key: string) {
        return await this.projectService.searchProject(key);
    }

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.GET_PROJECT)
    @Get('/details/:key')
    async getProjectByKey(@Param('key') key: string) {
        return this.projectService.getProjectByKey(key);
    }
}
