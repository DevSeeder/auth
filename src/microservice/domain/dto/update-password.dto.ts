import { DTO } from '@devseeder/nestjs-microservices-commons';

export class UpdatePasswordDTO extends DTO {
    username: string;
    projectKey: string;
    actualPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export class UpdatePasswordCodeDTO extends UpdatePasswordDTO {
    validationCode: string;
    validationTokenId: string;
}
