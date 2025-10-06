import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Find user by email and role customer
        const user = await this.userRepository.findOne({
            where: {
                email,
                role: UserRole.CUSTOMER,
                status: 'active' as any,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Update last login
        await this.userRepository.update(user.id, {
            last_login_at: new Date(),
        });

        // Generate JWT token
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        const token = this.jwtService.sign(payload);

        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                },
                token,
            },
        };
    }
}