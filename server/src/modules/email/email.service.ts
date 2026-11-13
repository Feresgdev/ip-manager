import { emailConfig, emailTransporter } from "../../config/email.config";

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export default class EmailService {
  constructor() {}

  async sendTestEmail(options: SendEmailOptions) {
    const result = await emailTransporter.sendMail({
      from: emailConfig.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    return result;
  }
}
