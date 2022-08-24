import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScopesModule } from '../scopes/scopes.module';
import { UsersController } from './users.controller';
import { UsersMongoose } from './users.repository';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        ScopesModule
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersMongoose, JwtService],
    exports: [UsersService]
})
export class UsersModule {}
