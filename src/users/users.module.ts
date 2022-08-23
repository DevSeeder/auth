import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScopesModule } from 'src/scopes/scopes.module';
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
    providers: [UsersService, UsersMongoose],
    exports: [UsersService]
})
export class UsersModule {}
