import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ScopesModule } from 'src/scopes/scopes.module';

@Module({
    imports: [
        UsersModule,
        ScopesModule,
        PassportModule,
        JwtModule.register({
            secret: 'jwtConstants.secret',
            signOptions: { expiresIn: '20s' }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
