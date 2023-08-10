import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get('secret-key') || 'secret-key',
  signOptions: {
    expiresIn: '7d',
  },
});
