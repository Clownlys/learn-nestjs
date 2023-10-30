import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsString({
    message: '用户名必须为字符串类型',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @Length(6, 30, {
    message: '用户名长度为6-30',
  })
  @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
    message: '用户名只能由字母、数字或者#$%_-这些字符组成',
  })
  username: string;
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string;
}
