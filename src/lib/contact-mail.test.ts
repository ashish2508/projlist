import assert from "node:assert/strict";
import test from "node:test";

import { buildMailtoHref, sendContactMail } from "./contact-mail";

test("buildMailtoHref includes the contact details", () => {
  const href = buildMailtoHref({
    targetEmail: "hello@example.com",
    name: "Jane Doe",
    email: "jane@company.com",
    message: "I would like to collaborate.",
  });

  assert.match(href, /^mailto:hello@example.com\?/);
  assert.match(href, /subject=Portfolio%20contact%20from%20Jane%20Doe/);
  assert.match(href, /Name%3A%20Jane%20Doe/);
});

test("sendContactMail falls back to a mailto draft when SMTP is not configured", async () => {
  const result = await sendContactMail({
    targetEmail: "hello@example.com",
    name: "Jane Doe",
    email: "jane@company.com",
    message: "I would like to collaborate.",
    env: {} as NodeJS.ProcessEnv,
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, "mailto");
  assert.ok(result.href);
  assert.match(result.href ?? "", /^mailto:hello@example.com\?/);
});
