import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "./dto/register.dto";



@Injectable()
export class AuthService {
constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
) {}

    async validateUser(username: string,password: string):Promise<any> {

            const user = await this.usersRepository.findOne({

                where: {username},
                select: ['id','username','email','password']
            })


              if(user && await bcrypt.compare(password, user.password)) {
                const {password,...result} = user;
                return result;
              }  

              return null;
    }


    async login(user:any) {

        const payload = {username:user.username, sub: user.id}

        return {

            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                email:user.email
            }
        }

    }


    async register (registerDto: RegisterDto): Promise<User> {


        const { username,email, password } = registerDto;

        const existingUser = await this.usersRepository.findOne({
            where: [{username}, { email }],
        })

        if(existingUser) {
            throw new UnauthorizedException('Username or email already exists')
        }


        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = this.usersRepository.create({
            username,
            email,
            password:hashedPassword
        });

        await this.usersRepository.save(newUser);

        const {password:_, ...result} = newUser;

        return result as User

    }


}
