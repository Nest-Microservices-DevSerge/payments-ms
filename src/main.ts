import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Payments-ms');

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  const app = await NestFactory.create(AppModule, { rawBody: true });
  //   AppModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       port: envs.port,
  //     },
  //   },
  // );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3003);

  logger.log(`Payments Microservice running on port ${envs.port}`);
}
bootstrap();
