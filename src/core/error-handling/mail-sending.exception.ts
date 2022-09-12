import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { HttpStatus } from '@nestjs/common';

export class MailSendingException extends CustomErrorException {
    constructor(msg: string) {
        super(
            'Error sending message: ' + msg,
            HttpStatus.INTERNAL_SERVER_ERROR,
            71
        );
    }
}
