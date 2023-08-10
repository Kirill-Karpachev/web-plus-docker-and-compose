import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secret-key') || 'secret-key',
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = await this.usersService.findUserById(jwtPayload.sub);
    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return user;
  }
}
