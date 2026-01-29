import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-refresh-token'),
      secretOrKey: String(configService.get<string>('JWT_REFRESH_SECRET')),
    });
  }

  validate(payload: unknown) {
    return payload;
  }
}
