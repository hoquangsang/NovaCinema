import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Public,
  WrapCreatedResponse,
  WrapOkResponse,
} from 'src/common/decorators';
import { AuthService } from '../services';
import {
  LoginReqDto,
  RefreshTokenReqDto,
  RegisterReqDto,
  ResendOtpReqDto,
  VerifyEmailReqDto,
  ForgotPasswordReqDto,
  ResetPasswordReqDto,
} from '../dtos/requests';
import { AccessTokenResDto, AuthResDto } from '../dtos/responses';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Login' })
  @WrapOkResponse({ dto: AuthResDto, message: 'Logged in successful' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() dto: LoginReqDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @ApiOperation({ description: 'Register' })
  @WrapCreatedResponse({ message: 'Registered successful. Please verify OTP' })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  public async register(@Body() dto: RegisterReqDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ description: 'Verify email' })
  @WrapOkResponse({ message: 'Email verified successful' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('email/verify')
  public async verify(@Body() dto: VerifyEmailReqDto) {
    return this.authService.verifyEmail(dto.email, dto.otp);
  }

  @ApiOperation({ description: 'Refresh token' })
  @WrapOkResponse({
    dto: AccessTokenResDto,
    message: 'Token refreshed successfully',
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  public async refreshToken(@Body() dto: RefreshTokenReqDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @ApiOperation({ description: 'Resend otp' })
  @WrapOkResponse({ message: 'OTP resent successfully' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('otp/resend')
  public async resendEmailOtp(@Body() dto: ResendOtpReqDto) {
    return this.authService.resendOtp(dto.email);
  }

  @ApiOperation({ description: 'Request password reset OTP' })
  @WrapOkResponse({ message: 'Password reset OTP sent to email' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  public async forgotPassword(@Body() dto: ForgotPasswordReqDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @ApiOperation({ description: 'Reset password with OTP' })
  @WrapOkResponse({ message: 'Password reset successful' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  public async resetPassword(@Body() dto: ResetPasswordReqDto) {
    return this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
  }
}
