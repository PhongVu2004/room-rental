import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private eventEmitter: EventEmitter2
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    if (user && await bcrypt.compare(pass, user.password)) {
      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Please verify your email first');
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }), // Refresh token lasts 7 days
      user: payload
    };
  }

  async register(data: any) {
    const existingUser = await this.usersService.findOne({ email: data.email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    
    let role = data.role || 'GUEST';
    if (data.email === 'daohuynhphongvu2004@gmail.com') {
      role = 'ADMIN';
    }

    const user = await this.usersService.create({
      ...data,
      role,
      password: hashedPassword,
      emailVerificationToken,
    });
    
    // Send real email
    await this.mailService.sendVerificationEmail(user.email, emailVerificationToken);
    
    // Emit notification event
    this.eventEmitter.emit('user.registered', { userId: user.id, name: user.name });

    const { password, ...result } = user;
    return result;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne({ id: payload.sub });
      if (!user) {
        throw new UnauthorizedException();
      }
      return this.login(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOne({ email });
    if (user) {
       const passwordResetToken = crypto.randomBytes(32).toString('hex');
       const passwordResetExpires = new Date();
       passwordResetExpires.setHours(passwordResetExpires.getHours() + 1); // Valid for 1 hour
       
       await this.usersService.update({
         where: { id: user.id },
         data: { passwordResetToken, passwordResetExpires },
       });
       
       // Send real email
       await this.mailService.sendPasswordResetEmail(user.email, passwordResetToken);
    }
    return { message: 'If an account with that email exists, we sent a password reset link.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findFirst({ passwordResetToken: token });
    
    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }
    
    if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await this.usersService.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
    
    return { message: 'Password has been successfully reset.' };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findFirst({ emailVerificationToken: token });
    
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }
    
    await this.usersService.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });
    
    return { message: 'Email has been successfully verified.' };
  }
}
