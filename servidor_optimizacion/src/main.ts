import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.enableCors();

  
  app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
  )
  await app.listen(3000);
}
bootstrap();
