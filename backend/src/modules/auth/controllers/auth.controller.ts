import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public, WrapCreatedResponse, WrapOkResponse } from "src/common/decorators";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/login.dto";
import { RegisterDto } from "../dtos/register.dto";
import { VerifyEmailDto } from "../dtos/verify-email.dto";
import { ResendOtpDto } from "../dtos/resend-otp.dto";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { AccessTokenDto, AuthDto } from "../dtos";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @ApiOperation({ description: 'login' })
  @WrapOkResponse({ dto: AuthDto, message: 'Login successful'})
  @Public()
  @HttpCode(200)
  @Post('login')
  login(
    @Body() dto: LoginDto
  ) {
    return this.authService.login(
      dto.email,
      dto.password
    );
  }

  @ApiOperation({ description: 'register' })
  @WrapCreatedResponse({ message: 'Register successful. Please verify OTP'})
  @Public()
  @HttpCode(201)
  @Post('register')
  register(
    @Body() dto: RegisterDto
  ) {
    return this.authService.register(dto);
  }

  @ApiOperation({ description: 'verify email' })
  @WrapOkResponse({ message: 'Verify email successful'})
  @Public()
  @HttpCode(200)
  @Post('email/verify')
  verify(
    @Body() dto: VerifyEmailDto
  ) {
    return this.authService.verifyEmail(dto.email, dto.otp);
  }

  @ApiOperation({ description: 'refresh token' })
  @WrapOkResponse({ dto: AccessTokenDto, message: 'Token refreshed successfully'})
  @Public()
  @HttpCode(200)
  @Post('refresh-token')
  refreshToken(
    @Body() dto: RefreshTokenDto
  ) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @ApiOperation({ description: 'resend otp' })
  @WrapOkResponse({ message: 'A new OTP has been sent to your email. Please check your inbox.'})
  @Public()
  @HttpCode(200)
  @Post('otp/resend')
  resendEmailOtp(
    @Body() dto: ResendOtpDto
  ) {
    return this.authService.resendOtp(dto.email);
  }
}