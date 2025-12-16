import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { jwtAccessConfig } from "src/config";
import { MailService } from "src/mail";
import { UsersModule } from "src/modules/users";
import { Otp, OtpSchema } from "./schemas/otp.schema";
import { OtpRepository } from "./repositories/otp.repository";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { OtpService } from "./services/otp.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    JwtModule.registerAsync(jwtAccessConfig),
    UsersModule,
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    MailService,
    JwtStrategy,
    OtpRepository,
    OtpService
  ]
})
export class AuthModule {}
