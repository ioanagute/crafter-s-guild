import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || '587'),
    secure: Number(process.env.SMTP_PORT || '587') === 465,
    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
  });

  async sendVerificationEmail(email: string, username: string, verificationUrl: string) {
    const from = process.env.SMTP_FROM;
    if (!process.env.SMTP_HOST || !from) {
      throw new ServiceUnavailableException({
        message: 'Email delivery is not configured.',
        code: 'EMAIL_NOT_CONFIGURED',
      });
    }

    await this.transporter.sendMail({
      from,
      to: email,
      subject: "Verify your Crafter's Guild account",
      text: [
        `Hello ${username},`,
        '',
        'Verify your account by opening this link:',
        verificationUrl,
        '',
        'If you did not create this account, you can ignore this email.',
      ].join('\n'),
      html: `
        <p>Hello ${username},</p>
        <p>Verify your Crafter's Guild account by clicking the link below:</p>
        <p><a href="${verificationUrl}">Verify your account</a></p>
        <p>If the button does not work, open this URL:</p>
        <p>${verificationUrl}</p>
        <p>If you did not create this account, you can ignore this email.</p>
      `,
    });
  }
}
