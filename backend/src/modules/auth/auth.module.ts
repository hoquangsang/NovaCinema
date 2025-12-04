import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/modules/users";
import { jwtAccessConfig } from "src/config";
import { MailService } from "src/mail";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { Otp, OtpSchema } from "./schemas/otp.schema";
import { OtpRepository } from "./repositories/otp.repository";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    UsersModule,
    JwtModule.registerAsync(jwtAccessConfig)
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    MailService,
    JwtStrategy,
    OtpRepository,
  ]
})
export class AuthModule {}
