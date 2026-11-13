import { Router } from "express";
import EmailService from "./email.service";
import EmailController from "./email.controller";

const router = Router();

const emailService = new EmailService();
const emailController = new EmailController(emailService);

/**
 * @swagger
 * /api/email/test:
 *   post:
 *     summary: Send a test email
 *     description: Sends a test email to the specified recipient.
 *     tags:
 *       - Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Invalid recipient
 *       500:
 *         description: Internal server error
 */
router.post("/test", emailController.sendTestEmail);

export default router;
