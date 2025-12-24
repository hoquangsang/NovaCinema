import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from '../schemas';

@Injectable()
export class OtpRepository {
  public constructor(
    @InjectModel(Otp.name)
    private otpModel: Model<OtpDocument>,
  ) {}

  public async upsertOtp(email: string, otpHash: string, expiresAt: Date) {
    return this.otpModel
      .findOneAndUpdate(
        { email },
        { email, otpHash, expiresAt, updatedAt: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec();
  }

  public async findValidOtp(email: string) {
    return this.otpModel
      .findOne({
        email,
        expiresAt: { $gte: new Date() },
      })
      .exec();
  }

  public async deleteByEmail(email: string) {
    return this.otpModel.deleteMany({ email }).exec();
  }
}
