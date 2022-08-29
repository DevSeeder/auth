import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GrantScopeUserDTO } from '../../domain/dto/grant-scope-user.dto';
import { EnumAuthScopes } from '../../domain/enum/enum-auth-scopes.enum';
import { JwtAuthGuard } from '../../core/jwt/jwt-auth.guard';
import { Scopes } from '../scopes/scopes.decorator';
import { User } from './users.schema';
import { UsersService } from './service/users.service';
import { CreateUserService } from './service/create-user.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly createUserService: CreateUserService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.CREATE_USER)
    @Post('/create')
    async createUser(@Body() user: User) {
        return this.createUserService.createUser(user);
    }

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.GRANT_SCOPE)
    @Post('/grantscope')
    async grantScopeForUser(@Body() scopeDTO: GrantScopeUserDTO) {
        return this.userService.grantScopeForUser(scopeDTO);
    }
}
