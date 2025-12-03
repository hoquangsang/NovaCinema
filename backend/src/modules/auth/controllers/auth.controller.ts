import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../services/auth.service";
import { LoginDto, RegisterDto } from "../dto/auth.dto";
import { SuccessResponse } from "src/common/responses";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @ApiOperation({ operationId: 'login' })
  @Post('login')
  async login(
    @Body() dto: LoginDto
  ) {
    const result = await this.authService.login(
      dto.email,
      dto.password
    );

    return SuccessResponse.of(result, 'Login successful');
  }

  @ApiOperation({ operationId: 'register' })
  @Post('register')
  async register(
    @Body() dto: RegisterDto
  ) {
    await this.authService.register(
      dto.email,
      dto.password,
      dto.userName
    );

    return SuccessResponse.created(null, 'Register successful');
  }
}