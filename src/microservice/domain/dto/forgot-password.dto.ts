import { DTO } from '@devseeder/nestjs-microservices-commons';

export class ForgotPasswordDTO extends DTO {
    username: string;
    projectKey: string;
}

export class ForgotPasswordConfirmDTO extends ForgotPasswordDTO {
    code: string;
}
