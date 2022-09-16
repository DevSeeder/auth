import { Model } from 'mongoose';
import {
    MongooseDocument,
    MongooseRepository
} from '@devseeder/nestjs-microservices-commons';

export abstract class AuthMongooseRepository<
    Collection,
    MongooseModel
> extends MongooseRepository<Collection, MongooseModel> {
    constructor(protected model: Model<MongooseModel>) {
        super(model);
    }

    async find<ResponseDB>(
        searchParams: any,
        select: any = {},
        sort: any = {}
    ): Promise<Array<ResponseDB & MongooseDocument>> {
        if (Object.keys(select).length === 0) select = { _id: 0 };

        let res = this.model.find(searchParams);

        if (typeof sort === 'object' && Object.keys(sort).length > 0)
            res = res.sort(sort);

        return res.select(select).lean().exec();
    }

    async findOne<ResponseDB>(
        searchParams: any,
        select: any = {},
        sort: any = {}
    ): Promise<ResponseDB & MongooseDocument> {
        if (Object.keys(select).length === 0) select = { _id: 0 };

        let res = this.model.findOne(searchParams);

        if (typeof sort === 'object' && Object.keys(sort).length > 0)
            res = res.sort(sort);

        return res.select(select).lean().exec();
    }
}
