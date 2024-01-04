import { DTO } from '@devseeder/nestjs-microservices-commons';

export class CreateProjectDTO extends DTO {
    name: string;
    description: string;
    projectKey: string;
    scopeKey: string;
    resources: string[];
}
