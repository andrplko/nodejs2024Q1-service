import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { config } from 'dotenv';

config();

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const pathToFile = join(process.cwd(), 'doc', 'api.yaml');
  const file = await readFile(pathToFile, {
    encoding: 'utf-8',
  });
  const document = parse(file);

  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
