import { Module } from '@nestjs/common';
import { AuthController, MfaController } from './controller';
import { AuthService, MfaService } from './service';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy, JwtStrategy } from './strategy';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user';
import { AUTH_REPOSITORY, AUTH_SERVICE, MFA_SERVICE } from './tokens';
import { StringValue } from '../../@types';
import { GoogleStrategy } from './strategy/google.strategy';
import { PrismaAuthPersistenceAdapter } from './repository/prisma-auth.persistence-adapter';
import { PrismaService } from '../prisma';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController, MfaController],
  providers: [
    {
      provide: AUTH_REPOSITORY,
      useFactory: (prisma: PrismaService) => {
        return new PrismaAuthPersistenceAdapter(prisma);
      },
      inject: [PrismaService],
    },
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: MFA_SERVICE,
      useClass: MfaService,
    },
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
