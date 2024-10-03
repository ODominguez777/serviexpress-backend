import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Usa dotenv para cargar la API key de SendGrid
  }

  async sendActivationEmail(to: string, activationUrl: string): Promise<void> {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL, // Reemplaza con tu dirección de correo válida
      subject: 'Account Activation',
      text: `Thank you for registering. Use the following code to activate your account: ${activationUrl}`,
      html: `
        <h1>Welcome to our platform</h1>
        <p>Click the link below to activate your account:</p>
        <a href="${activationUrl}">Activate Account</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error sending activation email, ${error}`
      );
    }
  }
}
