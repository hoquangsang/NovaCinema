import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ default: false })
  emailVerified!: boolean;

  @Prop({ required: true })
  password!: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  username?: string;

  @Prop()
  fullName?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ type: [String], default: ['user'] })
  roles!: string[];

  @Prop()
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
