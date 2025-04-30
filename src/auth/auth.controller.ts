import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";





@Controller('auth')
export class AuthController {


    constructor( private authService: AuthService ) {

    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login( @Request() req:any) {

        return this.authService.login(req.user)

    }



    @Post('register')
    async register( @Body() registerDto:RegisterDto) {
        return this.authService.register(registerDto)
    }


    @UseGuards(JwtAuthGuard)
    @Get('profile')

    getProfile(@Request() req: any) {
        return req.user
    }
}