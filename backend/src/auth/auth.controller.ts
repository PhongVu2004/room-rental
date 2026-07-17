import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    if (!body.refresh_token) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(body.refresh_token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string, password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      return `
        <html>
          <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;background-color:#fef2f2;">
            <div style="text-align:center;padding:40px;background:white;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
              <h1 style="color:#dc2626;">Verification Failed ❌</h1>
              <p>No verification token provided.</p>
            </div>
          </body>
        </html>
      `;
    }

    try {
      await this.authService.verifyEmail(token);
      return `
        <html>
          <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;background-color:#f0fdf4;">
            <div style="text-align:center;padding:40px;background:white;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
              <h1 style="color:#16a34a;">Email Verified Successfully! ✅</h1>
              <p>Your email has been verified. You can now close this page and log in to your account.</p>
            </div>
          </body>
        </html>
      `;
    } catch (e: any) {
      return `
        <html>
          <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;background-color:#fef2f2;">
            <div style="text-align:center;padding:40px;background:white;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
              <h1 style="color:#dc2626;">Verification Failed ❌</h1>
              <p>${e.message || 'Invalid or expired token.'}</p>
            </div>
          </body>
        </html>
      `;
    }
  }

  // Example of a Protected Route requiring JWT
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user; // User injected by JwtStrategy
  }

  // Example of a Role Protected API
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin-only')
  getAdminData() {
    return { message: 'This is protected data only for admins.' };
  }
}
