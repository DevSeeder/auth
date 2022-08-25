import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';

import { LocalAuthGuard } from '../local/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req, @Body() scopes: string[]) {
        return await this.authService.loginWithCredentials(
            req.headers.authorization,
            scopes
        );
    }
}
