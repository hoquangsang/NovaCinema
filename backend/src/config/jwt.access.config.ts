import { ConfigModule, ConfigService } from "@nestjs/config";

export const jwtAccessConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (cfg: ConfigService) => ({
    secret: cfg.getOrThrow<string>('JWT_ACCESS_SECRET'),
    signOptions: {
      expiresIn: cfg.getOrThrow<number>('JWT_ACCESS_EXPIRES'),
    },
  }),
};