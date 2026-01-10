import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtAccessConfig } from 'src/config';
import { UsersModule } from 'src/modules/users';
import { NotificationsModule, OtpService } from 'src/modules/notifications';
import { JwtStrategy } from './strategies';
import { AuthService } from './services';
import { AuthController } from './controllers';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync(jwtAccessConfig),
    UsersModule,
    NotificationsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
