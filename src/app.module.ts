import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './microservice/auth/auth.module';
import configuration from './config/configuration';
import { UsersModule } from './microservice/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration]
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                uri: config.get<string>('database.mongodb.connection')
            })
        }),
        AuthModule,
        UsersModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
