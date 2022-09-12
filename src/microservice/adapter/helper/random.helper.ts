import crypto from 'crypto';
import { EnumBufferEncoding } from '../../domain/enum/buffer-encoding.enum';

export class RandomHelper {
    static GenerateRandomNumber(lenght: number) {
        return (
            Math.floor(Math.random() * (9 * Math.pow(10, lenght - 1))) +
            Math.pow(10, lenght - 1)
        );
    }

    static GenerateHashString(lenght: number, encode: EnumBufferEncoding) {
        return crypto.randomBytes(lenght).toString(encode);
    }
}
