import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';
import { RoomType } from '../dto/create-room.dto';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;
  
  @Column({ nullable: true })
  description: string;
  
  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.PUBLIC
  })
  type: RoomType;
  
  @Column({ nullable: true })
  avatarUrl: string;
  
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Message, message => message.room)
  messages: Message[];

  @ManyToMany(() => User, user => user.rooms)
  @JoinTable({
    name: 'room_members',
    joinColumn: {
      name: 'roomId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id'
    }
  })
  members: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
