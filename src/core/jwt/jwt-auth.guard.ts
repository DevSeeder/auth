import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { EnumAuthScopes } from '../../microservice/domain/enum/enum-auth-scopes.enum';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { CustomJwtAuthGuard } from '@devseeder/nestjs-microservices-core';

dotenv.config();

@Injectable()
export class JwtAuthGuard extends CustomJwtAuthGuard {
    constructor(
        protected readonly reflector: Reflector,
        protected readonly jwtService: JwtService,
        protected readonly configService: ConfigService
    ) {
        super(reflector, jwtService, configService, EnumAuthScopes.ADM_SCOPE);
    }
}
