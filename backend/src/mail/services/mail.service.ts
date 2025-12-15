import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { emailConfig } from '../mail.config';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = emailConfig(config);
  }

  sendMail(options: { to: string; subject: string; html: string }) {
    return this.transporter.sendMail({
      from: `NovaCinema <${this.config.get('MAIL_USER')}>`,
      ...options,
    });
  }

  async sendOtp(email: string, otp: string) {
    const html = `
      <div style="font-size:16px">
        <p>Your email verification code:</p>
        <h2>${otp}</h2>
        <p>This code is valid for 5 minutes.</p>
      </div>
    `;

    return this.sendMail({
      to: email,
      subject: 'Email Verification - NovaCinema',
      html,
    });
  }
}
