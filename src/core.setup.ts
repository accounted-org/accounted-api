import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { EMAIL_JOB_DISPATCHER, EMAIL_QUEUE_NAME } from './modules/email';
import { Worker } from 'bullmq';
import { MailJobStrategyList } from './modules/email/@types';

export class CoreSetup {
  constructor() {}

  async execute() {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    this.setupSwagger(app);
    this.setupGlobalConfigs(app);
    this.startWorkers(app);
    this.setupLogger(app);
    this.setupCors(app);

    await app.listen(Number(process.env.PORT));
  }

  private setupSwagger(app: INestApplication) {
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

  private setupGlobalConfigs(app: INestApplication) {
    app.setGlobalPrefix(String(process.env.BASE_URL));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.use(helmet());
    app.use(cookieParser());
    app.enableShutdownHooks();
  }

  private startWorkers(app: INestApplication) {
    const dispatcher = app.get(EMAIL_JOB_DISPATCHER);
    new Worker(
      EMAIL_QUEUE_NAME,
      async (job) => {
        await dispatcher.dispatch(job.name, job.data as MailJobStrategyList);
      },
      {
        connection: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD,
        },
      },
    );
  }

  private setupLogger(app: INestApplication) {
    const logger = app.get(Logger);
    app.useLogger(logger);
    // to-do: mover urls para envs
    logger.log(`API up on http://localhost:${process.env.PORT}`, 'Bootstrap');
    logger.log(
      `Swagger: http://localhost:${process.env.PORT}/${process.env.DOCS_PREFIX}`,
      'Bootstrap',
    );
    logger.log(`Jaeger: http://localhost:16686`, 'Tracing');
    logger.log(`Grafana: http://localhost:4000`, 'Tracing');
    logger.log(`Prometheus: http://localhost:9090`, 'Tracing');
  }

  private setupCors(app: INestApplication) {
    app.enableCors({
      origin: process.env.CORS_ORIGIN,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
  }
}
