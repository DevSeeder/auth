import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends CustomErrorException {
    constructor(user: string) {
        super(
            `User ${user} already exists for this project`,
            HttpStatus.BAD_REQUEST,
            51
        );
    }
}
