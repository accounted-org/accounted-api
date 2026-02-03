import 'dotenv/config';
import './observability/tracing.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

class Main {
  constructor() {
    void this.boostrap();
  }

  private async boostrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    const logger = app.get(Logger);
    app.useLogger(logger);

    app.enableShutdownHooks();

    this.setupSwagger(app);
    this.setupGlobalConfigs(app);

    app.enableCors({
      origin: process.env.CORS_ORIGIN,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    await app.listen(String(process.env.PORT));

    logger.log(`API up on http://localhost:${process.env.PORT}`, 'Bootstrap');
    logger.log(
      `Swagger: http://localhost:${process.env.PORT}/${process.env.DOCS_PREFIX}`,
      'Bootstrap',
    );
    logger.log(
      `Jaeger: http://localhost:16686`,
      'Tracing',
    );
    logger.log(
      `Grafana: http://localhost:4000`,
      'Tracing',
    );
    logger.log(
      `Prometheus: http://localhost:9090`,
      'Tracing',
    );
  }

  setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Accounted API')
      .setDescription('Personal finance management API built with NestJS')
      .setVersion(String(process.env.API_VERSION))
      .addTag('accounted')
      .addGlobalResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
      })
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(String(process.env.DOCS_PREFIX), app, documentFactory);
  }

  setupGlobalConfigs(app: INestApplication) {
    app.setGlobalPrefix(String(process.env.BASE_URL));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.use(helmet());
    app.use(cookieParser());
  }
}

void new Main();
