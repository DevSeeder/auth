import { DTO } from '@devseeder/nestjs-microservices-commons';

export class CreateScopeDTO extends DTO {
    scopeID: string;
    description: string;
    projectKey: string;
    resourceKey: string;
    accessKey: string;
}
