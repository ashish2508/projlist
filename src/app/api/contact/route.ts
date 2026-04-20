import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const targetEmail = process.env.CONTACT_TARGET_EMAIL ?? "jha250805@gmail.com";

const buildMailtoHref = ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) => {
  const params = new URLSearchParams({
    subject: `Portfolio contact from ${name}`,
    body: `Name: ${name}\nEmail: ${email}\n\nPurpose:\n${message}`,
  });

  return `mailto:${targetEmail}?${params.toString()}`;
};

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? 587);

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const name = typeof payload?.name === "string" ? payload.name.trim() : "";
  const email = typeof payload?.email === "string" ? payload.email.trim() : "";
  const message = typeof payload?.message === "string" ? payload.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please include your name, email, and purpose for reaching out." },
      { status: 400 },
    );
  }

  const transporter = getTransporter();

  if (!transporter) {
    return NextResponse.json(
      {
        ok: true,
        mode: "mailto",
        href: buildMailtoHref({ name, email, message }),
        notice: "Email draft opened because direct mail delivery is not configured yet.",
      },
    );
  }

  const sender = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? targetEmail;

  try {
    await transporter.sendMail({
      to: targetEmail,
      from: sender,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nPurpose:\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send contact mail", error);
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again in a bit." },
      { status: 500 },
    );
  }
}
