import { Controller, Body, Post } from '@nestjs/common';
import SignupDto from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  @Post('signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }
}
