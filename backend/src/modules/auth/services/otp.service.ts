import { BadRequestException, Injectable } from '@nestjs/common';
import { HashUtil } from 'src/common/utils';
import { MailService } from 'src/modules/notifications';
import { OtpRepository } from '../repositories';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepo: OtpRepository,
    private readonly mailService: MailService,
  ) {}

  private generateOtp(length = 6): string {
    let code = '';
    for (let i = 0; i < length; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  }

  public async send(email: string): Promise<void> {
    const otp = this.generateOtp(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const otpHash = await HashUtil.hash(otp);

    await this.otpRepo.upsertOtp(email, otpHash, expiresAt);
    await this.mailService.sendOtp(email, otp);
  }

  public async verify(email: string, otp: string): Promise<void> {
    const record = await this.otpRepo.findValidOtp(email);
    if (!record) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const isMatch = await HashUtil.compare(otp, record.otpHash);
    if (!isMatch) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // consume OTP
    await this.otpRepo.deleteByEmail(email);
  }
}
