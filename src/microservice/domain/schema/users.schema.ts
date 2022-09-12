import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
    @Prop({ required: false })
    name?: string;

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false })
    projectKey?: string;

    @Prop({ required: false, type: Array })
    scopes?: string[];
}

const schema = SchemaFactory.createForClass(User);
schema.index({ username: 1, projectKey: 1 }, { unique: true });

export const UserSchema = schema;
