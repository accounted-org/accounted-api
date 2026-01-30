import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { JwtAuthGuard } from '../../src/modules/auth';
import { MockAuthGuard } from '../mocks/jwt-auth-mock.guard';
import { AppModule } from '../../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/signin (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: '',
        password: '',
      });

    expect(response.body).toHaveProperty('accessToken');
  });
});
