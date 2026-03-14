import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(emailOrUsername: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(emailOrUsername);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        };
    }

    async register(data: any) {
        const existingEmail = await this.usersService.findOne(data.email);
        if (existingEmail) {
            throw new ConflictException('Email already woven into the Guild');
        }

        const existingUsername = await this.usersService.findOne(data.username);
        if (existingUsername) {
            throw new ConflictException('This name is already claimed by another soul');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.usersService.create({
            email: data.email,
            username: data.username,
            password: hashedPassword,
            role: data.role || 'CUSTOMER'
        });

        return this.login(user);
    }
}
