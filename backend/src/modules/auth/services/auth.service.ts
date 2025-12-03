import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserService } from "src/modules/users";
import { refreshTokenOptions } from "src/config";
import { HashUtil } from "src/common/utils";
@Injectable()
export class AuthService {
  private readonly tokenConfig: {
    expiresIn: number;
    refreshExpiresIn: number;
    refreshOptions: JwtSignOptions;
  };

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private cfgService: ConfigService
  ) {
    const accessExpiresIn = parseInt(this.cfgService.getOrThrow('JWT_ACCESS_EXPIRES'), 10);
    const refreshExpiresIn = parseInt(this.cfgService.getOrThrow('JWT_REFRESH_EXPIRES'), 10);
    const refreshOptions = refreshTokenOptions(this.cfgService);

    this.tokenConfig = {
      expiresIn: accessExpiresIn,
      refreshExpiresIn: refreshExpiresIn,
      refreshOptions: refreshOptions
    };
  }

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
      email: user.email,
      roles: user.roles,
    });

    const refreshToken = this.jwtService.sign(
      { sub: user._id },
      refreshTokenOptions(this.cfgService)
    );

    const { password: _, ...userWithoutPassword } = user;
    return {
      accessToken: accessToken,
      expiresIn: this.tokenConfig.expiresIn,
      refreshToken: refreshToken,
      refreshExpiresIn: this.tokenConfig.refreshExpiresIn,
      ...userWithoutPassword
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