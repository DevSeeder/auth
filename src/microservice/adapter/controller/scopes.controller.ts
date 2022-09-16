import { ScopesService } from './../../domain/service/scopes.service';
import { EnumAuthScopes } from '../../domain/enum/enum-auth-scopes.enum';
import { JwtAuthGuard } from '../../../core/jwt/jwt-auth.guard';
import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { Scopes } from '@devseeder/nestjs-microservices-core';

@Controller('scopes')
export class ScopesController {
    constructor(private readonly scopeService: ScopesService) {}

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.GET_SCOPE)
    @Get('/search?')
    async searchScope(
        @Query('id') id: string,
        @Query('projectKey') projectKey: string,
        @Query('resourceKey') resourceKey: string
    ) {
        return await this.scopeService.searchScopes(
            id,
            projectKey,
            resourceKey
        );
    }

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.GET_SCOPE)
    @Get('/details?')
    async getScopeByid(@Query('id') id: string) {
        return this.scopeService.validateScopeById(id);
    }
}
