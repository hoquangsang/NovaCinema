import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/modules/users/users.module";
import { jwtAccessConfig } from "src/config/jwt.access.config";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync(jwtAccessConfig)
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule {}
