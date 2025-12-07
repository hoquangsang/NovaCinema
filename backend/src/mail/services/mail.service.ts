import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(private readonly cfg: ConfigService) {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: this.cfg.getOrThrow('MAIL_USER'),
        pass: this.cfg.getOrThrow('MAIL_PASS'),
      },
    });
  }

  sendMail(opts: { to: string; subject: string; html: string }) {
    return this.transporter.sendMail({
      from: `NovaCinema <${this.cfg.getOrThrow('MAIL_USER')}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
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
