import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDto, RoomType } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createRoomDto: CreateRoomDto, creatorId: number): Promise<Room> {
    const creator = await this.usersRepository.findOne({ where: { id: creatorId } });
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    const room = this.roomsRepository.create({
      name: createRoomDto.name,
      type: createRoomDto.type || RoomType.PUBLIC,
      members: [creator]
    });

    const savedRoom = await this.roomsRepository.save(room);

    // Add additional members if specified
    if (createRoomDto.memberIds && createRoomDto.memberIds.length > 0) {
      await this.addMembers(savedRoom.id, createRoomDto.memberIds);
    }

    const result = await this.findOne(savedRoom.id);
    if (!result) {
      throw new NotFoundException(`Failed to retrieve the newly created room with ID ${savedRoom.id}`);
    }
    return result;
  }

  async findAll() {
    return this.roomsRepository.find({
      relations: ['members'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUser(userId: number) {
    return this.roomsRepository
      .createQueryBuilder('room')
      .innerJoin('room.members', 'member')
      .where('member.id = :userId', { userId })
      .getMany();
  }

  async findOne(id: number): Promise<Room | null> {
    return this.roomsRepository.findOne({
      where: { id },
      relations: ['members']
    });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomsRepository.findOne({
      where: { id },
      relations: ['members']
    });
    
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    // Update basic fields
    if (updateRoomDto.name) room.name = updateRoomDto.name;
    if (updateRoomDto.description) room.description = updateRoomDto.description;
    if (updateRoomDto.type) room.type = updateRoomDto.type;
    if (updateRoomDto.avatarUrl) room.avatarUrl = updateRoomDto.avatarUrl;
    if (updateRoomDto.isActive !== undefined) room.isActive = updateRoomDto.isActive;

    // Save basic updates
    const updatedRoom = await this.roomsRepository.save(room);

    // Handle member additions if specified
    if (updateRoomDto.addMemberIds && updateRoomDto.addMemberIds.length > 0) {
      await this.addMembers(id, updateRoomDto.addMemberIds);
    }
    
    // Handle member removals if specified
    if (updateRoomDto.removeMemberIds && updateRoomDto.removeMemberIds.length > 0) {
      await this.removeMembers(id, updateRoomDto.removeMemberIds);
    }

    // Return updated room with members
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException(`Failed to retrieve the updated room with ID ${id}`);
    }
    return result;
  }

  async remove(id: number) {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return this.roomsRepository.remove(room);
  }

  async addMembers(roomId: number, memberIds: number[]): Promise<Room> {
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: ['members']
    });
    
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    const users = await this.usersRepository.findByIds(memberIds);
    if (users.length === 0) {
      throw new NotFoundException('No valid users found to add');
    }

    // Add new members
    room.members = [...room.members, ...users];
    await this.roomsRepository.save(room);
    
    const result = await this.findOne(roomId);
    if (!result) {
      throw new NotFoundException(`Failed to retrieve the room with ID ${roomId} after adding members`);
    }
    return result;
  }

  async removeMembers(roomId: number, memberIds: number[]): Promise<Room> {
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: ['members']
    });
    
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    // Filter out members to remove
    room.members = room.members.filter(member => !memberIds.includes(member.id));
    await this.roomsRepository.save(room);
    
    const result = await this.findOne(roomId);
    if (!result) {
      throw new NotFoundException(`Failed to retrieve the room with ID ${roomId} after removing members`);
    }
    return result;
  }
}
