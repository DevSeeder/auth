import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    AttemptSecurityToken,
    SecurityToken,
    SecurityTokenDocument
} from '../../domain/schema/security-tokens.schema';
import { AuthMongooseRepository } from '../../domain/repository/mongoose/auth-mongoose.repository';
import { EnumTokenType } from '../../domain/enum/enum-token-type.enum';
import { DateHelper } from '../helper/date.helper';
import { MongooseDocument } from '@devseeder/nestjs-microservices-commons';

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

    async inactiveActualTokens(
        type: EnumTokenType,
        userId: string,
        validated = false
    ): Promise<void> {
        await this.model.updateOne(
            {
                tokenType: type,
                userId
            },
            {
                $set: {
                    active: false,
                    validated,
                    inactivationDate: DateHelper.GetDateNow()
                }
            }
        );
    }

    async checkConfirmationCode(
        userId: string,
        tokenType: EnumTokenType,
        code = ''
    ): Promise<Array<SecurityToken & MongooseDocument>> {
        const objSearch = {
            userId,
            active: true,
            tokenType
        };

        if (code.length > 0) objSearch['token'] = code;

        return this.model.find<SecurityToken>(objSearch);
    }

    async updateConfirmToken(
        tokenId: string,
        validationToken: string,
        expDate: Date
    ): Promise<void> {
        await this.model.findByIdAndUpdate(tokenId, {
            $set: {
                active: false,
                processedDate: DateHelper.GetDateNow(),
                validationToken,
                expDateValidationToken: expDate
            }
        });
    }

    async pushLogAttempt(
        tokenId: string,
        attempt: AttemptSecurityToken
    ): Promise<void> {
        await this.model.findByIdAndUpdate(tokenId, {
            $push: {
                attemps: attempt
            }
        });
    }
}
