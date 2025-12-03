import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import { UserService } from "src/modules/users";
import { refreshTokenOptions } from "src/config";
import { HashUtil } from "src/common/utils";
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private cfgService: ConfigService
  ) {}

  //
  async login(
    email: string,
    password: string,
  ) {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException('User not found');

    const isMatch = await HashUtil.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Invalid password');

    const accessToken = this.jwtService.sign({
      sub: user._id,
      email: user.email
    });

    const refreshToken = this.jwtService.sign(
      { sub: user._id },
      refreshTokenOptions(this.cfgService)
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: this.cfgService.getOrThrow<number>('JWT_ACCESS_EXPIRES'),
    }
  }

  async register(
    email: string,
    password: string,
    userName?: string
  ) {
    const existed = await this.userService.findByEmail(email);
    if (existed)
      throw new BadRequestException('Email already exists');

    const pwhashed = await HashUtil.hash(password);
    const user = await this.userService.createUser({
      email: email,
      password: pwhashed,
      userName: userName
    });
  }
}