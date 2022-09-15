import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScopesMongoose } from '../repository/scopes.repository';
import { Scope, ScopeSchema } from '../../domain/schema/scopes.schema';
import { ScopesService } from '../../domain/service/scopes.service';
import { ScopesController } from '../controller/scopes.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Scope.name, schema: ScopeSchema }])
    ],
    controllers: [ScopesController],
    providers: [ScopesService, ScopesMongoose, JwtService],
    exports: [ScopesService]
})
export class ScopesModule {}
