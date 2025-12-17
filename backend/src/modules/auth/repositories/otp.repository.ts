import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from 'src/modules/auth/schemas';

@Injectable()
export class OtpRepository {
  constructor(
    @InjectModel(Otp.name)
    private otpModel: Model<OtpDocument>,
  ) {}

  async upsertOtp(email: string, otpHash: string, expiresAt: Date) {
    return this.otpModel
      .findOneAndUpdate(
        { email },
        { email, otpHash, expiresAt, updatedAt: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec();
  }

  async findValidOtp(email: string) {
    return this.otpModel
      .findOne({
        email,
        expiresAt: { $gte: new Date() },
      })
      .exec();
  }

  async deleteByEmail(email: string) {
    return this.otpModel.deleteMany({ email }).exec();
  }
}
