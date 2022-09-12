import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../../domain/service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from './users.module';
import { ScopesModule } from './scopes.module';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@devseeder/nestjs-microservices-core';

dotenv.config();

@Module({
    imports: [
        UsersModule,
        ScopesModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: config.get<string>('auth.jwt.expires')
                }
            })
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
