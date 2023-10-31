import { IsNotEmpty, Length } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @Length(2, 20)
  username: string;

  @IsNotEmpty()
  password: string;
}
