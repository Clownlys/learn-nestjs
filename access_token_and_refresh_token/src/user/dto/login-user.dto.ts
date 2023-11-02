import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({
    message: 'username is required',
  })
  username: string;

  @IsNotEmpty()
  password: string;
}
