import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    SecurityToken,
    SecurityTokenDocument
} from '../../domain/schema/security-tokens.schema';
import { AuthMongooseRepository } from '../../domain/repository/mongoose/auth-mongoose.repository';
import { EnumTokenType } from '../../domain/enum/enum-token-type.enum';
import { DateHelper } from '../helper/date.helper';

@Injectable()
export class SecurityTokensMongoose extends AuthMongooseRepository<
    SecurityToken,
    SecurityTokenDocument
> {
    constructor(
        @InjectModel(SecurityToken.name)
        model: Model<SecurityTokenDocument>
    ) {
        super(model);
    }

    inactiveActualTokens(type: EnumTokenType, userId: string) {
        return this.model.updateOne(
            {
                tokenType: type,
                userId
            },
            {
                $set: {
                    active: false,
                    inactivationDate: DateHelper.GetDateNow()
                }
            }
        );
    }
}
