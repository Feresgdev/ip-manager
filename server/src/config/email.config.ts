import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 587);
const user = process.env.SMTP_USER;
const password = process.env.SMTP_PASSWORD;

if (!host || !user || !password) {
  throw new Error("Missing SMTP configuration in environment variables");
}

export const emailTransporter = nodemailer.createTransport({
  host,
  port,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user,
    pass: password,
  },
});

export const emailConfig = {
  from: process.env.EMAIL_FROM ?? user,
};
