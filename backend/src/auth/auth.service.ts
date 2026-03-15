import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from './email.service';
import { getAuthJwtExpiresIn, getVerificationExpiryDate, parseDurationToSeconds } from './auth.utils';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async validateUser(emailOrUsername: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(emailOrUsername);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    private buildUserPayload(user: any) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        };
    }

    private createVerificationToken() {
        const token = randomBytes(32).toString('hex');
        const tokenHash = createHash('sha256').update(token).digest('hex');
        return { token, tokenHash };
    }

    private buildVerificationUrl(token: string) {
        const apiBaseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT ?? 3000}`;
        return `${apiBaseUrl}/auth/verify-email?token=${token}`;
    }

    async login(identifier: string, password: string) {
        const user = await this.validateUser(identifier, password);
        if (!user) {
            throw new UnauthorizedException({
                message: 'Invalid credentials.',
                code: 'INVALID_CREDENTIALS',
            });
        }

        if (!user.emailVerifiedAt) {
            throw new ForbiddenException({
                message: 'Verify your email before signing in.',
                code: 'EMAIL_NOT_VERIFIED',
            });
        }

        const payload = { username: user.username, sub: user.id, role: user.role };
        return {
            token: this.jwtService.sign(payload, { expiresIn: parseDurationToSeconds(getAuthJwtExpiresIn()) }),
            user: this.buildUserPayload(user),
        };
    }

    async register(data: RegisterDto) {
        const normalizedEmail = data.email.trim().toLowerCase();
        const normalizedUsername = data.username.trim();

        const existingEmail = await this.usersService.findByEmail(normalizedEmail);
        if (existingEmail) {
            throw new ConflictException({
                message: 'Email is already in use.',
                code: 'EMAIL_TAKEN',
            });
        }

        const existingUsername = await this.usersService.findByUsernameInsensitive(normalizedUsername);
        if (existingUsername) {
            throw new ConflictException({
                message: 'Username is already in use.',
                code: 'USERNAME_TAKEN',
            });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const { token, tokenHash } = this.createVerificationToken();
        const verificationExpiresAt = getVerificationExpiryDate();
        const user = await this.usersService.create({
            email: normalizedEmail,
            username: normalizedUsername,
            password: hashedPassword,
            role: 'CUSTOMER',
            emailVerificationTokenHash: tokenHash,
            emailVerificationExpiresAt: verificationExpiresAt,
        });

        await this.emailService.sendVerificationEmail(
            user.email,
            user.username,
            this.buildVerificationUrl(token),
        );

        return {
            message: 'Verification email sent.',
            requiresEmailVerification: true,
        };
    }

    async resendVerification(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user || user.emailVerifiedAt) {
            return {
                message: 'If the account exists, a verification email has been sent.',
            };
        }

        const { token, tokenHash } = this.createVerificationToken();
        const verificationExpiresAt = getVerificationExpiryDate();
        await this.usersService.updateVerification(user.id, tokenHash, verificationExpiresAt);
        await this.emailService.sendVerificationEmail(
            user.email,
            user.username,
            this.buildVerificationUrl(token),
        );

        return {
            message: 'If the account exists, a verification email has been sent.',
        };
    }

    async verifyEmail(token: string) {
        const tokenHash = createHash('sha256').update(token).digest('hex');
        const user = await this.usersService.findByVerificationTokenHash(tokenHash);

        if (!user) {
            return 'invalid';
        }

        if (!user.emailVerificationExpiresAt || user.emailVerificationExpiresAt.getTime() < Date.now()) {
            return 'expired';
        }

        await this.usersService.markEmailVerified(user.id);
        return 'success';
    }

    async getProfile(userId: number) {
        return this.usersService.getSessionProfile(userId);
    }
}
