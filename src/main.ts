import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // opens up the API to be accessed from any domain
  app.enableCors();

  // sets the global prefix for all routes
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
