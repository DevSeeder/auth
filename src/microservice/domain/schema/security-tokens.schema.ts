import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnumCodeType } from '../enum/enum-code-type.enum';
import { EnumTokenType } from '../enum/enum-token-type.enum';

export type SecurityTokenDocument = SecurityToken & Document;

@Schema({ collection: 'securityTokens', timestamps: true })
export class SecurityToken {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, type: String })
    tokenType: EnumTokenType;

    @Prop({ required: false, type: String, default: EnumCodeType.NUMBER })
    codeType: EnumCodeType;

    @Prop({ required: true })
    token: string;

    @Prop({ required: true })
    expires: string;

    @Prop({ required: true, type: Date })
    expirationDate: Date;

    @Prop({ required: true, type: Boolean, default: true })
    active: boolean;

    @Prop({ required: false, type: Array, default: [] })
    attemps: AttemptSecurityToken[];

    @Prop({ required: false, type: Date })
    inactivationDate: Date;

    @Prop({ required: false, type: Date })
    processedDate: Date;

    @Prop({ required: false })
    validationToken: string;

    @Prop({ required: false, type: Date })
    expDateValidationToken: Date;

    @Prop({ required: true, type: Boolean, default: false })
    validated: boolean;
}

export class AttemptSecurityToken {
    @Prop({ required: true, type: Date })
    dateAttempt: Date;

    @Prop({ required: false, type: String })
    ip: string;

    @Prop({ required: true, type: String })
    attempt: string;

    @Prop({ required: true, type: Boolean, default: false })
    assert: boolean;

    @Prop({ required: false, type: String })
    errorMessage: string;
}

const schema = SchemaFactory.createForClass(SecurityToken);

export const SecurityTokenSchema = schema;
