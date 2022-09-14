import { DTO } from '@devseeder/nestjs-microservices-commons';

export class CreateUserDTO extends DTO {
    name?: string;
    username: string;
    password: string;
    projectKey: string;
    scopes: string[];
}
