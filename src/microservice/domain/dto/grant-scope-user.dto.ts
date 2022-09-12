import { DTO } from '@devseeder/nestjs-microservices-commons';

export class GrantScopeUserDTO extends DTO {
    username: string;
    projectKey: string;
    scopes: string[];
}
