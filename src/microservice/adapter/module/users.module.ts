import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ScopesModule } from './scopes.module';
import { UsersController } from '../controller/users.controller';
import { UsersMongoose } from '../repository/users.repository';
import { User, UserSchema } from '../../domain/schema/users.schema';
import { CreateUserService } from '../../domain/service/users/create-user.service';
import { GrantUserScopesService } from '../../../microservice/domain/service/users/grant-user-scopes.service';
import { ValidateUserService } from '../../../microservice/domain/service/users/validate-user.service';

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
