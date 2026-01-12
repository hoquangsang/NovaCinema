import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail, { MailDataRequired } from '@sendgrid/mail';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private readonly mailFrom: string;
  private readonly mailFromName: string;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {
    this.mailFrom = this.config.getOrThrow('MAIL_FROM');
    this.mailFromName = this.config.get('MAIL_FROM_NAME') ?? 'NovaCinema';
    sgMail.setApiKey(this.config.getOrThrow('SENDGRID_API_KEY'));
  }

  async send(options: SendMailOptions) {
    const { html, subject, to: mailTo } = options;

    const msg: MailDataRequired = {
      to: mailTo,
      from: {
        email: this.mailFrom,
        name: this.mailFromName,
      },
      subject: subject,
      html: html,
    };

    try {
      await sgMail.send(msg);
      this.logger.log('[MAIL] Sent OK');
      return true;
    } catch (err) {
      this.logger.error('[MAIL] Send FAILED');
      this.logger.error(err);
      throw err;
    }
  }
}
