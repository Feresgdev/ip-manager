import { Request, Response, Router } from "express";
import { BadRequestError } from "../../global/errors";
import EmailService from "./email.service";

export default class EmailController {
  constructor(private readonly emailService: EmailService) {}

  sendTestEmail = async (req: Request, res: Response) => {
    const { to } = req.body;

    if (!to || typeof to !== "string") {
      throw new BadRequestError("Recipient email is required");
    }

    await this.emailService.sendTestEmail({
      to,
      subject: "Test Email from My API",
      text: "Your email configuration is working correctly!",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email configuration successful!</h2>
        <p>Your Express API successfully sent this test email.</p>
        <p>SMTP configuration is working correctly.</p>
      </div>
    `,
    });

    return res.status(200).json({
      success: true,
      message: "Test email sent successfully",
    });
  };
}
