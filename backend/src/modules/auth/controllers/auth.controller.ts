import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public, WrapCreatedResponse, WrapOkResponse } from "src/common/decorators";
import { AuthService } from "../services/auth.service";
import {
  AccessTokenResponseDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
  ResendOtpRequestDto,
  VerifyEmailRequestDto,
  AuthResponseDto,
} from "../dtos";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @ApiOperation({ description: 'Login' })
  @WrapOkResponse({ dto: AuthResponseDto, message: 'Logged in successful'})
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(
    @Body() dto: LoginRequestDto
  ) {
    return this.authService.login(
      dto.email,
      dto.password
    );
  }

  @ApiOperation({ description: 'Register' })
  @WrapCreatedResponse({ message: 'Registered successful. Please verify OTP'})
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  public async register(
    @Body() dto: RegisterRequestDto
  ) {
    return this.authService.register(dto);
  }

  @ApiOperation({ description: 'Verify email' })
  @WrapOkResponse({ message: 'Email verified successful'})
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('email/verify')
  public async verify(
    @Body() dto: VerifyEmailRequestDto
  ) {
    return this.authService.verifyEmail(dto.email, dto.otp);
  }

  @ApiOperation({ description: 'Refresh token' })
  @WrapOkResponse({ dto: AccessTokenResponseDto, message: 'Token refreshed successfully'})
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  public async refreshToken(
    @Body() dto: RefreshTokenRequestDto
  ) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @ApiOperation({ description: 'Resend otp' })
  @WrapOkResponse({ message: 'OTP resent successfully'})
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('otp/resend')
  public async resendEmailOtp(
    @Body() dto: ResendOtpRequestDto
  ) {
    return this.authService.resendOtp(dto.email);
  }
}