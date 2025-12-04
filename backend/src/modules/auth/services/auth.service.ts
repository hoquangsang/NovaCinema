import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import { MailService } from "src/mail";
import { refreshTokenOptions } from "src/config";
import { generateOtp, HashUtil } from "src/common/utils";
import { UserService } from "src/modules/users";
import { OtpRepository } from "../repositories/otp.repository";

@Injectable()
export class AuthService {
  private readonly accessExpiresIn: number;
  private readonly refreshExpiresIn: number;

  constructor(
    private userService: UserService,
    private mailService: MailService,
    private otpRepo: OtpRepository,
    private jwtService: JwtService,
    private cfgService: ConfigService
  ) {
    this.accessExpiresIn = Number(this.cfgService.getOrThrow('JWT_ACCESS_EXPIRES'));
    this.refreshExpiresIn = Number(this.cfgService.getOrThrow('JWT_REFRESH_EXPIRES'));
  }

  //
  async login(
    email: string,
    password: string,
  ) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await HashUtil.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    await this.userService.updateUserByEmail(email, { lastLogin: new Date() });

    const accessToken = this.signAccessToken(user);
    const refreshToken = this.signRefreshToken(user._id.toString());

    const { password: _, ...userWithoutPassword } = user;
    return {
      accessToken: accessToken,
      expiresIn: this.accessExpiresIn,
      refreshToken: refreshToken,
      refreshExpiresIn: this.refreshExpiresIn,
      ...userWithoutPassword
    }
  }
  private signAccessToken(user: any) {
    return this.jwtService.sign({
      sub: user._id,
      email: user.email,
      roles: user.roles,
    });
  }
  private signRefreshToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId },
      refreshTokenOptions(this.cfgService)
    );
  }

  //
  async register(
    payload: {
      email: string;
      password: string;
      username?: string;
      fullName?: string;
      phoneNumber?: string;
      dateOfBirth?: string;
    }
  ) {
    const existed = await this.userService.findByEmail(payload.email);
    if (existed) throw new BadRequestException('Email already exists');

    const hashed = await HashUtil.hash(payload.password);
    const user = await this.userService.createUser({
      email: payload.email,
      password: hashed,
      username: payload.username,
      phoneNumber: payload.phoneNumber,
      fullName: payload.fullName,
      dateOfBirth: payload.dateOfBirth,
    });

    await this.createAndSendOtp(payload.email);
    return true;
  }

  private async createAndSendOtp(email: string) {
    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const otpHash = await HashUtil.hash(otp);

    await this.otpRepo.upsertOtp(email, otpHash, expiresAt);
    await this.mailService.sendOtp(email, otp);
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('Refresh token is required');

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, { secret: this.cfgService.getOrThrow('JWT_REFRESH_SECRET') });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userService.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

    const newAccessToken = this.signAccessToken(user);

    return {
      accessToken: newAccessToken,
      expiresIn: this.accessExpiresIn
    };
  }

  //
  async verifyEmail(email: string, otp: string) {
    const record = await this.otpRepo.findValidOtp(email);
    if (!record) throw new BadRequestException('Invalid or expired OTP');

    const isMatch = await HashUtil.compare(otp, record.otpHash);
    if (!isMatch) throw new BadRequestException('Invalid or expired OTP');

    await this.otpRepo.deleteByEmail(email);
    await this.userService.markEmailVerified(email);

    return true;
  }

  //
  async resendOtp(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');
    if (user.emailVerified) throw new BadRequestException('Email already verified');

    await this.createAndSendOtp(email);
    return true;
  }
}