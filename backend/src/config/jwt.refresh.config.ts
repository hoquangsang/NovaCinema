import { ConfigService } from "@nestjs/config";
import { JwtSignOptions } from "@nestjs/jwt";

export const refreshTokenOptions = (cfg: ConfigService): JwtSignOptions => ({
  secret: cfg.getOrThrow('JWT_REFRESH_SECRET'),
  expiresIn: parseInt(cfg.getOrThrow('JWT_REFRESH_EXPIRES'), 10),
});