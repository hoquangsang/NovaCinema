import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { mailConfig } from 'src/config';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = mailConfig(config);
  }

  public send(options: SendMailOptions) {
    return this.transporter.sendMail({
      from: `NovaCinema <${this.config.get('MAIL_USER')}>`,
      ...options,
    });
  }
}
