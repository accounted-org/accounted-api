import { Module } from '@nestjs/common';
import { AuthController, MfaController } from './controller';
import { AuthService, MfaService } from './service';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user';
import { AUTH_SERVICE, MFA_SERVICE } from './tokens';
import { StringValue } from '../../@types';
import { GoogleStrategy } from './strategies/google.strategy';

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
