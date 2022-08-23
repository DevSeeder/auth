import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from 'src/local/local-auth.guard';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.loginWithCredentials(req.headers.authorization);
    }

    @UseGuards(JwtAuthGuard)
    @Get('info')
    getUserInfo(@Request() req) {
        return req.user;
    }
}
