import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messagesRepository.create({
      content: createMessageDto.content,
      user: { id: createMessageDto.userId },
      room: { id: createMessageDto.roomId }
    });
    
    return this.messagesRepository.save(message);
  }

  async findAll() {
    return this.messagesRepository.find({
      relations: ['user', 'room'],
      order: { createdAt: 'ASC' }
    });
  }

  async findByRoom(roomId: number) {
    return this.messagesRepository.find({
      where: { room: { id: roomId } },
      relations: ['user'],
      order: { createdAt: 'ASC' }
    });
  }

  async findOne(id: number) {
    return this.messagesRepository.findOne({
      where: { id },
      relations: ['user', 'room']
    });
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.messagesRepository.findOne({ where: { id } });
    if (!message) {
      return null;
    }
    
    if (updateMessageDto.content) {
      message.content = updateMessageDto.content;
    }
    
    return this.messagesRepository.save(message);
  }

  async remove(id: number) {
    const message = await this.messagesRepository.findOne({ where: { id } });
    if (!message) {
      return null;
    }
    
    return this.messagesRepository.remove(message);
  }

  async markAsRead(id: number) {
    const message = await this.messagesRepository.findOne({ where: { id } });
    if (!message) {
      return null;
    }
    
    message.isRead = true;
    return this.messagesRepository.save(message);
  }
}
