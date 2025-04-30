import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, MaxLength, IsEnum, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { CreateRoomDto, RoomType } from './create-room.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(RoomType)
  type?: RoomType;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  addMemberIds?: number[];
  
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  removeMemberIds?: number[];
}
