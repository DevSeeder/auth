import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';

import { LocalAuthGuard } from '../../../core/local/local-auth.guard';
import { AuthService } from '../../domain/service/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req, @Body() scopes: string[]) {
        return await this.authService.loginWithCredentials(
            req.headers.authorization,
            req.headers.projectkey,
            scopes
        );
    }
}
