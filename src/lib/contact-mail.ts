import nodemailer from "nodemailer";

export type ContactMailInput = {
  targetEmail: string;
  name: string;
  email: string;
  message: string;
  env?: NodeJS.ProcessEnv;
};

export type ContactMailResult =
  | {
    ok: true;
    mode: "mailto";
    href: string;
    notice: string;
  }
  | {
    ok: true;
    mode: "smtp";
    messageId?: string;
  }
  | {
    ok: false;
    error: string;
  };

export function buildMailtoHref({
  targetEmail,
  name,
  email,
  message,
}: {
  targetEmail: string;
  name: string;
  email: string;
  message: string;
}) {
  const params = new URLSearchParams({
    subject: `Portfolio contact from ${name}`,
    body: `Name: ${name}\nEmail: ${email}\n\nPurpose:\n${message}`,
  });

  return `mailto:${targetEmail}?${params.toString()}`;
}

export function getTransporter(env: NodeJS.ProcessEnv = process.env) {
  const host = env.SMTP_HOST;
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;
  const port = Number(env.SMTP_PORT ?? 587);

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendContactMail({
  targetEmail,
  name,
  email,
  message,
  env = process.env,
}: ContactMailInput): Promise<ContactMailResult> {
  const sender = env.SMTP_FROM ?? env.SMTP_USER ?? targetEmail;
  const transporter = getTransporter(env);

  if (!transporter) {
    return {
      ok: true,
      mode: "mailto",
      href: buildMailtoHref({ targetEmail, name, email, message }),
      notice: "Email draft opened because direct mail delivery is not configured yet.",
    };
  }

  try {
    const info = await transporter.sendMail({
      to: targetEmail,
      from: sender,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nPurpose:\n${message}`,
    });

    return {
      ok: true,
      mode: "smtp",
      messageId: typeof info?.messageId === "string" ? info.messageId : undefined,
    };
  } catch (error) {
    console.error("Failed to send contact mail", error);

    return {
      ok: true,
      mode: "mailto",
      href: buildMailtoHref({ targetEmail, name, email, message }),
      notice: "Email draft opened because direct mail delivery is not available right now.",
    };
  }
}
