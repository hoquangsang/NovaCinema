import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtAccessConfig } from 'src/config';
import { MailService } from 'src/modules/notifications';
import { UsersModule } from 'src/modules/users';
import { Otp, OtpSchema } from './schemas';
import { OtpRepository } from './repositories';
import { JwtStrategy } from './strategies';
import { OtpService } from './services';
import { AuthService } from './services';
import { AuthController } from './controllers';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    JwtModule.registerAsync(jwtAccessConfig),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, JwtStrategy, OtpRepository, OtpService],
})
export class AuthModule {}
