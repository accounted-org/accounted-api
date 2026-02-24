import { NestFactory } from '@nestjs/core';
import { BackofficeModule } from './backoffice/';

export class BackofficeSetup {
  async execute() {
    const backofficeApp = await NestFactory.create(
      BackofficeModule,

      {
        bufferLogs: true,
      },
    );

    backofficeApp.setGlobalPrefix('backoffice');

    await backofficeApp.listen(Number(process.env.BACKOFFICE_PORT));

    console.log('Backoffice is running on port', process.env.BACKOFFICE_PORT);
  }
}
