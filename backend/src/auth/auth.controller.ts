import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')  // Removed 'api/' prefix to match frontend
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('signin')  // Added signin endpoint to match frontend
    @HttpCode(HttpStatus.OK)
    async signin(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}