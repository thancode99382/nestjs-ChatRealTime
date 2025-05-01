import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    MessagesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') || '24h' }
      }),
      inject: [ConfigService],
    })
  ],
  providers: [ChatGateway],
  exports: [ChatGateway]
})
export class ChatModule {}