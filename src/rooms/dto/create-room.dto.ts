import { IsNotEmpty, IsString, IsOptional, MaxLength, IsEnum, IsArray, IsNumber } from 'class-validator';

export enum RoomType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  DIRECT = 'direct',
}

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  memberIds?: number[];
}
