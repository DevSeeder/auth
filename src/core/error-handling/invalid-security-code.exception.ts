import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { HttpStatus } from '@nestjs/common';

export class InvalidSecurityCodeException extends CustomErrorException {
    constructor(
        message: string,
        public readonly refId: string,
        code: EnumInvalidSecurityCodeErrorCode,
        status = HttpStatus.BAD_REQUEST
    ) {
        super(message, status, code);
    }
}

export enum EnumInvalidSecurityCodeErrorCode {
    INVALID_CODE = 80,
    EXPIRED_CODE = 81,
    MAX_ATTEMPTS = 82,
    INVALID_VALIDATION_CODE = 83,
    EXPIRED_VALIDATION_CODE = 84,
    ALREADY_VALIDATED_VALIDATION_CODE = 84
}
