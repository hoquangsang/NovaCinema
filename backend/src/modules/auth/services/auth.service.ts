import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { refreshTokenOptions } from 'src/config';
import { HashUtil } from 'src/common/utils';
import { UserRepository } from 'src/modules/users';
import { UserRoleType } from 'src/modules/users/types';
import { JwtPayload } from '../types';
import { OtpService } from './otp.service';

type RegisterInput = {
  email: string;
  password: string;
  username?: string;
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
};

@Injectable()
export class AuthService {
  private readonly accessExpiresIn: number;
  private readonly refreshExpiresIn: number;

  constructor(
    private readonly usersRepo: UserRepository,
    private readonly otpService: OtpService,
    private jwtService: JwtService,
    private cfgService: ConfigService,
  ) {
    this.accessExpiresIn = Number(
      this.cfgService.getOrThrow('JWT_ACCESS_EXPIRES'),
    );
    this.refreshExpiresIn = Number(
      this.cfgService.getOrThrow('JWT_REFRESH_EXPIRES'),
    );
  }

  /** */
  public async login(email: string, password: string) {
    const existed = await this.usersRepo.query.findOneByEmail({ email });
    if (!existed) throw new UnauthorizedException('User not found');
    if (!existed.emailVerified)
      throw new ForbiddenException('Email is not verified');

    const { password: hashedPass, ...user } = existed;
    const isMatch = await HashUtil.compare(password, hashedPass);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const now = new Date();
    const updateResult = await this.usersRepo.command.updateOneById({
      id: user._id,
      update: {
        lastLoginAt: now,
      },
    });
    const loggedInUser = user;
    if (updateResult.matchedCount && updateResult.modifiedCount)
      loggedInUser.lastLoginAt = updateResult.modifiedItem.lastLoginAt;

    const accessToken = this.signAccessToken(user);
    const refreshToken = this.signRefreshToken(user._id);

    return {
      user: loggedInUser,
      accessToken: accessToken,
      expiresIn: this.accessExpiresIn,
      refreshToken: refreshToken,
      refreshExpiresIn: this.refreshExpiresIn,
    };
  }

  private signAccessToken(user: {
    _id: string;
    email: string;
    roles: UserRoleType[];
  }) {
    const payload: JwtPayload = {
      sub: user._id,
      email: user.email,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
  }

  private signRefreshToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId },
      refreshTokenOptions(this.cfgService),
    );
  }

  /** */
  public async register(payload: RegisterInput) {
    const { email, password, username, fullName, phoneNumber, dateOfBirth } =
      payload;
    const existed = await this.usersRepo.query.findOneByEmail({ email });
    if (existed) throw new BadRequestException('Email already exists');

    const hashed = await HashUtil.hash(password);
    const result = await this.usersRepo.command.createOne({
      data: {
        email: email,
        password: hashed,
        username: username,
        phoneNumber: phoneNumber,
        fullName: fullName,
        dateOfBirth: dateOfBirth,
      },
    });
    if (!result.insertedCount)
      throw new BadRequestException('Registration failed');
    const user = result.insertedItem;

    await this.otpService.send(user.email);
    return true;
  }

  /** */
  public async refreshToken(refreshToken: string) {
    if (!refreshToken)
      throw new BadRequestException('Refresh token is required');

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.cfgService.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersRepo.query.findOneById({
      id: payload.sub,
      inclusion: {
        _id: true,
        email: true,
        roles: true,
      },
    });
    if (!user) throw new UnauthorizedException('User not found');

    return {
      accessToken: this.signAccessToken(user),
      expiresIn: this.accessExpiresIn,
    };
  }

  /** */
  public async verifyEmail(email: string, otp: string) {
    const existed = await this.usersRepo.query.findOneByEmail({
      email,
      inclusion: {
        _id: true,
        email: true,
        emailVerified: true,
      },
    });
    if (!existed) throw new BadRequestException('User not found');
    if (existed.emailVerified)
      throw new BadRequestException('Email already verified');

    await this.otpService.verify(existed.email, otp);
    await this.usersRepo.command.updateOneById({
      id: existed._id,
      update: {
        emailVerified: true,
      },
    });

    return true;
  }

  /** */
  public async resendOtp(email: string) {
    const existed = await this.usersRepo.query.findOneByEmail({
      email,
      inclusion: {
        email: true,
        emailVerified: true,
      },
    });
    if (!existed) throw new BadRequestException('User not found');
    if (existed.emailVerified)
      throw new BadRequestException('Email already verified');

    await this.otpService.send(existed.email);
    return true;
  }
}
