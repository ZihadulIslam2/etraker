import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrackingDto {
  @IsEmail()
  @IsNotEmpty()
  recipientEmail: string;

  @IsString()
  @IsOptional()
  subject?: string;
}
