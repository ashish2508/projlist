import { NextRequest, NextResponse } from "next/server";

import { sendContactMail } from "@/lib/contact-mail";

export const runtime = "nodejs";

const targetEmail = process.env.CONTACT_TARGET_EMAIL ?? "jha250805@gmail.com";

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

  const result = await sendContactMail({
    targetEmail,
    name,
    email,
    message,
  });

  if (result.ok && result.mode === "mailto") {
    return NextResponse.json({
      ok: true,
      mode: "mailto",
      href: result.href,
      notice: result.notice,
    });
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
