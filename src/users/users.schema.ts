import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;
}

const schema = SchemaFactory.createForClass(User);
schema.index({ username: 1 }, { unique: true });

export const UserSchema = schema;
