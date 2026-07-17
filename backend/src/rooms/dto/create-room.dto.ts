import { IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';

export class CreateRoomDto {
  @ApiProperty({ example: 'Beautiful Studio near HUTECH' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A very nice studio apartment.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 3500000 })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({ example: '123 D2 Street' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Ho Chi Minh' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Binh Thanh' })
  @IsString()
  district: string;

  @ApiPropertyOptional({ example: '["WiFi", "AC", "Parking"]', description: 'JSON string of amenities array' })
  @IsOptional()
  @IsString()
  amenities?: string;

  @ApiPropertyOptional({ example: '["HUTECH", "KHTN"]', description: 'JSON string of universities array' })
  @IsOptional()
  @IsString()
  nearbyUniversities?: string;

  @ApiPropertyOptional({ enum: RoomStatus, default: RoomStatus.AVAILABLE })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}
