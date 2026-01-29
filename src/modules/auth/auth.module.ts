import { Module } from '@nestjs/common';
import { AuthController } from './controller';
import { AuthService } from './service';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from '@types';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';
import { ConfigService } from '@nestjs/config';

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
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
