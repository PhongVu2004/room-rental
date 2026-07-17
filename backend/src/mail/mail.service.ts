import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {}

  private async sendViaFrontend(email: string, subject: string, html: string) {
    // Vercel deployment URL or localhost
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const emailApiUrl = `${frontendUrl}/api/email`;
    const secret = this.configService.get<string>('EMAIL_API_SECRET') || '';

    try {
      this.logger.log(`Sending email to ${email} via Frontend API at ${emailApiUrl}...`);
      
      const response = await fetch(emailApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject,
          html,
          secret,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Frontend API returned error ${response.status}: ${errorText}`);
        return false;
      }

      const data = await response.json();
      this.logger.log(`Frontend API sent email successfully: ${data.messageId}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to send email via frontend API: ${error.message}`, error.stack);
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const backendUrl = this.configService.get<string>('BACKEND_URL') || 'http://localhost:3001';
    const verificationLink = `${backendUrl}/auth/verify-email?token=${token}`;
    
    const html = `
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
      `;

    await this.sendViaFrontend(email, 'Please verify your email address', html);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const frontendBaseUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetLink = `${frontendBaseUrl}/reset-password?token=${token}`;
    
    const html = `
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
      `;

    await this.sendViaFrontend(email, 'Reset your password', html);
  }
}
