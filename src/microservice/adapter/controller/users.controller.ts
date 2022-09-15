import { UpdateUserDTO } from './../../domain/dto/update-user.dto';
import { CustomResponse } from '@devseeder/nestjs-microservices-core/dist/interface/custom-response.interface';
import { ValidateUserService } from './../../domain/service/users/validate-user.service';
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { GrantScopeUserDTO } from '../../domain/dto/grant-scope-user.dto';
import { EnumAuthScopes } from '../../domain/enum/enum-auth-scopes.enum';
import { JwtAuthGuard } from '../../../core/jwt/jwt-auth.guard';
import { GrantUserScopesService } from '../../domain/service/users/grant-user-scopes.service';
import { CreateUserService } from '../../domain/service/users/create-user.service';
import { CreateUserDTO } from '../../domain/dto/create-user.dto';
import { GetUser } from '../../domain/decorator/get-user.decorator';
import { Scopes } from '@devseeder/nestjs-microservices-core';
import { UpdateUserService } from '../../domain/service/users/update-user.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: GrantUserScopesService,
        private readonly getUserService: ValidateUserService,
        private readonly createUserService: CreateUserService,
        private readonly updateUserService: UpdateUserService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.CREATE_USER)
    @Post('/create')
    async createUser(@Body() user: CreateUserDTO, @GetUser() actualUser) {
        return this.createUserService.createUser(user, actualUser);
    }

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.GRANT_SCOPE)
    @Post('/grantscope')
    async grantScopeForUser(@Body() scopeDTO: GrantScopeUserDTO) {
        return this.userService.grantScopeForUser(scopeDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.GET_USER)
    @Get('/search?')
    async searchUser(
        @Query('name') name: string,
        @Query('projectKey') projectKey: string
    ) {
        return this.getUserService.searchUser(name, projectKey);
    }

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.GET_USER)
    @Get('/details/:id')
    async getUser(@Param('id') id: string) {
        return this.getUserService.getById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.UPDATE_USER)
    @Put('/update/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() user: Partial<UpdateUserDTO>
    ) {
        return this.updateUserService.updateById(id, user);
    }

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.ACTIVATE_USER)
    @Post('/activate/:id')
    async activateUser(@Param('id') id: string) {
        return this.updateUserService.updateUserActive(id, true);
    }

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.INACTIVATE_USER)
    @Post('/inactivate/:id')
    async inactivateUser(@Param('id') id: string) {
        return this.updateUserService.updateUserActive(id, false);
    }
}
