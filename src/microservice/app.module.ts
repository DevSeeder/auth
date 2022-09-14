import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './adapter/module/auth.module';
import { UsersModule } from './adapter/module/users.module';
import { SecurityModule } from './adapter/module/security.module';
import { ConfigurationModule } from './adapter/module/config.module';

@Module({
    imports: [
        ConfigurationModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                uri: config.get<string>('database.mongodb.connection')
            })
        }),
        AuthModule,
        UsersModule,
        SecurityModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
