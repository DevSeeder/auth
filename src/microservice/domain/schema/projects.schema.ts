import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ collection: 'projects', timestamps: true })
export class Project {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: true, unique: true })
    projectKey: string;

    @Prop({ required: true, unique: true })
    scopeKey: string;

    @Prop({ required: true, type: Array })
    resources: string[];
}

const schema = SchemaFactory.createForClass(Project);

export const ProjectSchema = schema;
