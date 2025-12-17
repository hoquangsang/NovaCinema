import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './services';

@Module({
  imports: [ConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class NotificationsModule {}
