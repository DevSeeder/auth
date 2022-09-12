import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { HttpStatus } from '@nestjs/common';

export class InvalidPasswordException extends CustomErrorException {
    constructor(
        message: string,
        code: EnumInvalidPassErrorCode,
        status = HttpStatus.NOT_ACCEPTABLE
    ) {
        super(message, status, code);
    }
}

export enum EnumInvalidPassErrorCode {
    INVALID_PASS = 40,
    INVALID_PASS_CONFIRM = 41,
    INVALID_ACTUAL_PASS = 42
}
