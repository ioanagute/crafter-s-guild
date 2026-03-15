import { Body, Controller, Get, HttpCode, Post, Query, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { getAuthCookieName, getAuthCookieOptions } from './auth.utils';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(body.identifier, body.password);
        res.cookie(getAuthCookieName(), result.token, getAuthCookieOptions());
        return { user: result.user };
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Post('resend-verification')
    async resendVerification(@Body() body: ResendVerificationDto) {
        return this.authService.resendVerification(body.email);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string, @Res() res: Response) {
        const status = token ? await this.authService.verifyEmail(token) : 'invalid';
        const frontendUrl = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:3001';
        return res.redirect(`${frontendUrl}/auth/verified?status=${status}`);
    }

    @Post('logout')
    @HttpCode(204)
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie(getAuthCookieName(), getAuthCookieOptions());
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: any) {
        return this.authService.getProfile(req.user.userId);
    }
}
