import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../services/auth.service";
import { LoginDto, RegisterDto } from "../dto/auth.dto";

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
    return this.authService.login(
      dto.email,
      dto.password
    );
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
  }
}