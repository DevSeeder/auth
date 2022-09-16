import { DTO } from '@devseeder/nestjs-microservices-commons';

export class UpdateUserDTO extends DTO {
    name?: string;
    username: string;
}
