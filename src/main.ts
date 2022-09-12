import {
    CustomErrorExceptionFilter,
    HttpExceptionFilter
} from '@devseeder/microservices-exceptions';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './microservice/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get<ConfigService>(ConfigService);

    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));
    app.useGlobalFilters(new CustomErrorExceptionFilter(httpAdapterHost));

    await app.listen(configService.get<string>('api.port'));
}
bootstrap();
