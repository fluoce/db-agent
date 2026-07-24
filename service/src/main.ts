import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = process.env.PORT ?? 8000;

  await app.listen(port, '0.0.0.0', () => {
    const address = `http://localhost:${port}`;
    console.log(`Application is running on: ${address}`);
  });
}
bootstrap();
