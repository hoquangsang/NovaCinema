import { ConfigModule, ConfigService } from "@nestjs/config";

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