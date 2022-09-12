import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { HttpStatus } from '@nestjs/common';

export class ForbbidenScopeException extends CustomErrorException {
    constructor(scope: string) {
        super(
            `Forbidden Scope '${scope}'`,
            HttpStatus.FORBIDDEN,
            HttpStatus.FORBIDDEN
        );
    }
}
