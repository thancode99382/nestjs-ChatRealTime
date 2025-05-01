import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { RoomsService } from './rooms/rooms.service';
import { RoomType } from './rooms/dto/create-room.dto';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Seeder');
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const authService = app.get(AuthService);
    const roomsService = app.get(RoomsService);

    // Create test users
    logger.log('Creating test users...');
    
    const user1 = await authService.register({
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123',
    });
    
    const user2 = await authService.register({
      username: 'user2',
      email: 'user2@example.com',
      password: 'password123',
    });
    
    const user3 = await authService.register({
      username: 'user3',
      email: 'user3@example.com',
      password: 'password123',
    });
    
    logger.log('Test users created successfully');

    // Create sample rooms
    logger.log('Creating sample chat rooms...');
    
    const generalRoom = await roomsService.create(
      {
        name: 'General Chat',
        type: RoomType.PUBLIC,
        memberIds: [user2.id, user3.id],
      },
      user1.id,
    );
    
    const techRoom = await roomsService.create(
      {
        name: 'Tech Discussion',
        type: RoomType.PUBLIC,
        memberIds: [user3.id],
      },
      user2.id,
    );

    logger.log('Sample chat rooms created successfully');
    
    logger.log('Seeding completed successfully');
  } catch (error) {
    logger.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();