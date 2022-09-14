import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScopesMongoose } from '../repository/scopes.repository';
import { Scope, ScopeSchema } from '../../domain/schema/scopes.schema';
import { ScopesService } from '../../domain/service/scopes.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Scope.name, schema: ScopeSchema }])
    ],
    controllers: [],
    providers: [ScopesService, ScopesMongoose],
    exports: [ScopesService]
})
export class ScopesModule {}
