import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  otpHash!: string;

  @Prop({ required: true })
  expiresAt!: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
OtpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);
