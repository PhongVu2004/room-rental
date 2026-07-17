import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.init();
  }

  private async init() {
    try {
      const user = this.configService.get<string>('SMTP_USER');
      const pass = this.configService.get<string>('SMTP_PASS');
      
      if (!user || !pass) {
        this.logger.warn('SMTP_USER or SMTP_PASS not found in environment variables. Falling back to Ethereal Email for testing.');
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, 
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        return;
      }
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
          user: user,
          pass: pass,
        },
        family: 4, // Force IPv4 to prevent Gmail dropping IPv6 connections from Render
      });
      
      this.logger.log('Gmail SMTP transporter initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Mail transporter', error);
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    if (!this.transporter) {
      this.logger.error('Mail transporter is not ready yet');
      return;
    }

    const backendUrl = this.configService.get<string>('BACKEND_URL') || 'http://localhost:3001';
    const verificationLink = `${backendUrl}/auth/verify-email?token=${token}`;
    
    const info = await this.transporter.sendMail({
      from: '"Room Rental App" <noreply@roomrental.com>',
      to: email,
      subject: 'Please verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Welcome to Room Rental!</h2>
          <p style="color: #555; font-size: 16px;">Thank you for registering. Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
          </div>
          <p style="color: #555; font-size: 14px;">If the button doesn't work, you can copy and paste the following link into your browser:</p>
          <p style="color: #0066cc; font-size: 14px; word-break: break-all;">${verificationLink}</p>
          <p style="color: #999; font-size: 12px; margin-top: 40px; text-align: center;">If you did not create an account, no further action is required.</p>
        </div>
      `,
    });

    this.logger.log(`Verification email sent to: ${email}`);
    
    // Only log ethereal preview if it's ethereal
    if (info.messageId && info.messageId.includes('ethereal')) {
      this.logger.log(`[ETHEREAL PREVIEW URL] You can view this email at: ${nodemailer.getTestMessageUrl(info)}`);
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    if (!this.transporter) {
      this.logger.error('Mail transporter is not ready yet');
      return;
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;
    
    const info = await this.transporter.sendMail({
      from: '"Room Rental App" <noreply@roomrental.com>',
      to: email,
      subject: 'Reset your password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="color: #555; font-size: 16px;">You are receiving this email because we received a password reset request for your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #555; font-size: 14px;">If the button doesn't work, you can copy and paste the following link into your browser:</p>
          <p style="color: #0066cc; font-size: 14px; word-break: break-all;">${resetLink}</p>
          <p style="color: #999; font-size: 12px; margin-top: 40px; text-align: center;">If you did not request a password reset, no further action is required.</p>
        </div>
      `,
    });

    this.logger.log(`Password reset email sent to: ${email}`);
    
    // Only log ethereal preview if it's ethereal
    if (info.messageId && info.messageId.includes('ethereal')) {
      this.logger.log(`[ETHEREAL PREVIEW URL] You can view this email at: ${nodemailer.getTestMessageUrl(info)}`);
    }
  }
}
