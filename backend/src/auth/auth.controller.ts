import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth') // ← Esto define el prefijo
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // ← Esto es /auth/login
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
