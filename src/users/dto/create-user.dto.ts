import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['INTERN', 'ENGINEER', 'MANAGER'], {
    message: 'Invalid role. Must be one of INTERN, ENGINEER, MANAGER',
  })
  role: 'INTERN' | 'ENGINEER' | 'MANAGER';
}
