import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ScopesModule } from '../scopes/scopes.module';
import { UsersController } from './users.controller';
import { UsersMongoose } from './users.repository';
import { User, UserSchema } from './users.schema';
import { GrantUserScopesService } from './service/grant-user-scopes.service';
import { CreateUserService } from './service/create-user.service';
import { ValidateUserService } from './service/validate-user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        ScopesModule,
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    controllers: [UsersController],
    providers: [
        GrantUserScopesService,
        UsersMongoose,
        JwtService,
        CreateUserService,
        ValidateUserService
    ],
    exports: [GrantUserScopesService, CreateUserService, ValidateUserService]
})
export class UsersModule {}
