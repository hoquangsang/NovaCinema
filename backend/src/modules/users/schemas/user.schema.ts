import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { USER_ROLES, USER_ROLE_VALUES } from 'src/modules/users/constants';
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

  @Prop({
    type: [String],
    enum: USER_ROLE_VALUES,
    default: [USER_ROLES.USER],
  })
  roles!: UserRoleType[];

  @Prop({ default: true })
  isActive?: boolean;

  @Prop()
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
