import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: '邮箱', example: 'user@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ description: '密码（6-20位）', example: 'password123' })
  @IsString()
  @MinLength(6, { message: '密码长度至少6位' })
  @MaxLength(20, { message: '密码长度最多20位' })
  password: string;

  @ApiProperty({ description: '确认密码', example: 'password123' })
  @IsString()
  passwordConfirm: string;

  @ApiPropertyOptional({ description: '昵称（2-20位）', example: '用户昵称' })
  @IsString()
  @MinLength(2, { message: '昵称长度至少2位' })
  @MaxLength(20, { message: '昵称长度最多20位' })
  @IsOptional()
  nickname?: string;
}

export class LoginDto {
  @ApiProperty({ description: '邮箱', example: 'user@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @MinLength(6, { message: '密码长度至少6位' })
  password: string;
}
