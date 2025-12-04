import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SuccessResponse } from "src/common/responses";
import { Public } from "src/common/decorators";
import { AuthService } from "../services/auth.service";
import { LoginRequestDto } from "../dtos/login.request.dto";
import { RegisterRequestDto } from "../dtos/register.request.dto";
import { VerifyEmailRequestDto } from "../dtos/verify-email.request.dto";
import { ResendOtpRequestDto } from "../dtos/resend-otp.request.dto";
import { RefreshTokenRequestDto } from "../dtos/refresh-token.request.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @ApiOperation({ operationId: 'login' })
  @Public()
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() dto: LoginRequestDto
  ) {
    const result = await this.authService.login(
      dto.email,
      dto.password
    );
    return SuccessResponse.of(result, 'Login successful');
  }

  @ApiOperation({ operationId: 'register' })
  @Public()
  @HttpCode(201)
  @Post('register')
  async register(
    @Body() dto: RegisterRequestDto
  ) {
    await this.authService.register(dto);
    return SuccessResponse.created(null, 'Register successful. Please verify OTP');
  }

  @Public()
  @HttpCode(200)
  @Post('verify-email')
  async verify(
    @Body() dto: VerifyEmailRequestDto
  ) {
    await this.authService.verifyEmail(dto.email, dto.otp);
    return SuccessResponse.of(null, 'Verify email successful');
  }

  @ApiOperation({ operationId: 'refreshToken' })
  @Public()
  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(
    @Body() dto: RefreshTokenRequestDto
  ) {
    const result = await this.authService.refreshToken(dto.refreshToken);
    return SuccessResponse.of(result, 'Token refreshed successfully');
  }

  @ApiOperation({ operationId: 'opt/resend' })
  @Public()
  @HttpCode(200)
  @Post('otp/resend')
  async resendEmailOtp(
    @Body() dto: ResendOtpRequestDto
  ) {
    await this.authService.resendOtp(dto.email);
    return SuccessResponse.of(null, 'A new OTP has been sent to your email. Please check your inbox.');
  }
}