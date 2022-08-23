import { Body, Controller, Post } from '@nestjs/common';
import { GrantScopeUserDTO } from 'src/dto/grant-scope-user.dto';
import { User } from './users.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post('/create')
    async login(@Body() user: User) {
        return this.userService.createUser(user);
    }

    @Post('/grantscope')
    async grantScopeForUser(@Body() scopeDTO: GrantScopeUserDTO) {
        return this.userService.grantScopeForUser(scopeDTO);
    }
}
