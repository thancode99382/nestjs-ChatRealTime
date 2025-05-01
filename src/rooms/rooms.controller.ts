import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto, @Request() req) {
    // Get user ID from JWT token
    const userId = req.user.id;
    return this.roomsService.create(createRoomDto, userId);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get('my-rooms')
  findMyRooms(@Request() req) {
    // Get user ID from JWT token
    const userId = req.user.id;
    return this.roomsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }

  @Post(':id/members')
  addMembers(@Param('id') id: string, @Body() body: { memberIds: number[] }) {
    return this.roomsService.addMembers(+id, body.memberIds);
  }

  @Delete(':id/members')
  removeMembers(@Param('id') id: string, @Body() body: { memberIds: number[] }) {
    return this.roomsService.removeMembers(+id, body.memberIds);
  }
}
