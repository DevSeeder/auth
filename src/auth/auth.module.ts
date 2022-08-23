import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { LocalStrategy } from '../local/local.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'jwtConstants.secret',
            signOptions: { expiresIn: '20s' }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
