import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SuccessResponse } from "src/common/responses";
import { Public } from "src/common/decorators";
import { AuthService } from "../services/auth.service";
import { LoginDto, RegisterDto } from "../dto/auth.dto";

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
    @Body() dto: LoginDto
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
    @Body() dto: RegisterDto
  ) {
    await this.authService.register(
      dto.email,
      dto.password,
      dto.username
    );

    return SuccessResponse.created(null, 'Register successful');
  }
}