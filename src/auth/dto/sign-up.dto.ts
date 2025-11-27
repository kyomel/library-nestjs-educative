import { IsEmail, MaxLength, MinLength } from 'class-validator';

export default class SignupDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(32)
  password: string;
}
