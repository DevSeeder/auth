import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScopesModule } from './scopes.module';
import { SecurityController } from '../controller/security.controller';
import {
    SecurityToken,
    SecurityTokenSchema
} from '../../domain/schema/security-tokens.schema';
import { UsersModule } from './users.module';
import { PasswordRecoveryService } from '../../domain/service/security/password-recovery.service';
import { GenerateSecurityTokenService } from '../../domain/service/security/generate-security-token.service';
import { SecurityTokensMongoose } from '../repository/security-tokens.repository';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from './mail.module';
import { ConfirmSecurityTokenService } from '../../domain/service/security/confirm-security-token.service';
import { ValidationTokenService } from '../../../microservice/domain/service/security/validation-token.service';
import { ProjectsModule } from './projects.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SecurityToken.name, schema: SecurityTokenSchema }
        ]),
        UsersModule,
        ScopesModule,
        MailModule,
        ProjectsModule
    ],
    controllers: [SecurityController],
    providers: [
        PasswordRecoveryService,
        GenerateSecurityTokenService,
        SecurityTokensMongoose,
        ConfirmSecurityTokenService,
        ValidationTokenService,
        JwtService
    ],
    exports: [
        PasswordRecoveryService,
        GenerateSecurityTokenService,
        SecurityTokensMongoose,
        ConfirmSecurityTokenService,
        ValidationTokenService
    ]
})
export class SecurityModule {}
