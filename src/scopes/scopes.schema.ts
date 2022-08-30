import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScopeDocument = Scope & Document;

@Schema({ collection: 'scopes', timestamps: true })
export class Scope {
    @Prop({ required: true, unique: true })
    scopeID: string;

    @Prop({ required: true, unique: true })
    projectKey: string;

    @Prop({ required: true })
    resourceKey: string;

    @Prop({ required: true })
    accessKey: string;
}

const schema = SchemaFactory.createForClass(Scope);
schema.index({ scopeID: 1 }, { unique: true });
schema.index({ projectKey: 1, resourceKey: 1, accessKey: 1 }, { unique: true });

export const ScopeSchema = schema;
