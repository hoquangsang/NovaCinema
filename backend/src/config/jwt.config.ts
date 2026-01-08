import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export const jwtAccessConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (cfg: ConfigService) => ({
    secret: cfg.getOrThrow('JWT_ACCESS_SECRET'),
    signOptions: {
      expiresIn: parseInt(cfg.getOrThrow('JWT_ACCESS_EXPIRES'), 10),
    },
  }),
};

export const refreshTokenOptions = (cfg: ConfigService): JwtSignOptions => ({
  secret: cfg.getOrThrow('JWT_REFRESH_SECRET'),
  expiresIn: parseInt(cfg.getOrThrow('JWT_REFRESH_EXPIRES'), 10),
});
