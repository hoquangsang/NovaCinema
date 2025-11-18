import { ConfigService } from "@nestjs/config";
import { JwtSignOptions } from "@nestjs/jwt";

export const refreshTokenOptions = (cfg: ConfigService): JwtSignOptions => ({
  secret: cfg.getOrThrow<string>('JWT_REFRESH_SECRET'),
  expiresIn: cfg.getOrThrow<number>('JWT_REFRESH_EXPIRES'),
});