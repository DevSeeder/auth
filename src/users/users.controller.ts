import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GrantScopeUserDTO } from '../dto/grant-scope-user.dto';
import { EnumAuthScopes } from '../enum/enum-auth-scopes.enum';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { Scopes } from '../scopes/scopes.decorator';
import { User } from './users.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.CREATE_USER)
    @Post('/create')
    async createUser(@Body() user: User) {
        return this.userService.createUser(user);
    }

    @UseGuards(JwtAuthGuard)
    @Scopes(EnumAuthScopes.GRANT_SCOPE)
    @Post('/grantscope')
    async grantScopeForUser(@Body() scopeDTO: GrantScopeUserDTO) {
        return this.userService.grantScopeForUser(scopeDTO);
    }
}
