import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { USERROLE_TYPES } from 'src/modules/users/constants';
import { UserRoleType } from 'src/modules/users/types';

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

  @Prop({ type: [String], enum: USERROLE_TYPES, default: ['USER'] })
  roles!: UserRoleType[];

  @Prop({ default: true })
  active?: boolean;

  @Prop()
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
