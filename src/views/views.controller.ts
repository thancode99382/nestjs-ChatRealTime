import { Controller, Get, Render, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class ViewsController {
  @Get('auth/login')
  @Render('auth/login')
  loginPage() {
    return {};
  }

  @Get('auth/register')
  @Render('auth/register')
  registerPage() {
    return {};
  }

  @Get('chat')
  @Render('chat')
  chatPage() {
    return { title: 'Chat' };
  }
}