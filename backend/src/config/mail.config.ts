import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

export const mailConfig = (config: ConfigService): Transporter => {
  return createTransport({
    service: 'gmail',
    auth: {
      user: config.getOrThrow('MAIL_USER'),
      pass: config.getOrThrow('MAIL_PASS'),
    },
  });
};
