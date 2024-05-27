import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;

  @IsNotEmpty()
  name: string;
}
