import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from '../messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  private connectedUsers = new Map<number, Socket>();

  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Get token from handshake auth
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      // Verify token
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      
      // Store user connection
      this.connectedUsers.set(userId, client);
      
      // Join personal room for private messages
      client.join(`user-${userId}`);
      
      console.log(`Client connected: ${userId}`);
    } catch (error) {
      console.log('Connection error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Find and remove the disconnected user
    for (const [userId, socket] of this.connectedUsers.entries()) {
      if (socket === client) {
        this.connectedUsers.delete(userId);
        console.log(`Client disconnected: ${userId}`);
        break;
      }
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: number }
  ) {
    client.join(`room-${data.roomId}`);
    return { event: 'joinedRoom', roomId: data.roomId };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: number }
  ) {
    client.leave(`room-${data.roomId}`);
    return { event: 'leftRoom', roomId: data.roomId };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { content: string, roomId: number, userId: number }
  ) {
    // Save message to database
    const message = await this.messagesService.create({
      content: data.content,
      userId: data.userId,
      roomId: data.roomId
    });

    // Broadcast to room
    this.server.to(`room-${data.roomId}`).emit('newMessage', message);
    
    return { success: true, message };
  }
}