"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/portfolio-data";

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_URL;

// Strict email format check (no spaces, valid local & domain parts, 2+ char TLD)
const STRICT_EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Common disposable / temporary email domains
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "maildrop.cc",
  "throwawaymail.com",
  "fakeinbox.com",
  "dispostable.com",
  "mailnesia.com",
]);

/**
 * Strips subaddressing ("+tag" after the username) and normalizes Gmail dot-tricks
 * so `abc+123@gmail.com` and `a.b.c@gmail.com` both resolve to `abc@gmail.com`.
 */
export function normalizeEmail(raw: string): {
  valid: boolean;
  canonical: string;
  error?: string;
} {
  const trimmed = raw.trim().toLowerCase();
  if (!STRICT_EMAIL_RE.test(trimmed)) {
    return { valid: false, canonical: trimmed, error: "Please enter a valid email address." };
  }

  const [localPart, domainPart] = trimmed.split("@");
  if (!localPart || !domainPart || domainPart.startsWith(".") || domainPart.endsWith(".") || domainPart.includes("..")) {
    return { valid: false, canonical: trimmed, error: "Please enter a valid email domain." };
  }

  if (localPart.includes("+")) {
    return {
      valid: false,
      canonical: trimmed,
      error: "Please enter your primary email address without '+' aliases (e.g. name@domain.com).",
    };
  }

  if (DISPOSABLE_DOMAINS.has(domainPart)) {
    return {
      valid: false,
      canonical: trimmed,
      error: "Temporary or disposable email addresses are not accepted.",
    };
  }

  const canonicalDomain = domainPart === "googlemail.com" ? "gmail.com" : domainPart;
  const baseLocal = localPart.split("+")[0];
  const canonicalLocal = canonicalDomain === "gmail.com" ? baseLocal.replace(/\./g, "") : baseLocal;

  if (!canonicalLocal) {
    return { valid: false, canonical: trimmed, error: "Please enter a valid email address." };
  }

  return {
    valid: true,
    canonical: `${canonicalLocal}@${canonicalDomain}`,
  };
}

type Status = "idle" | "sending" | "done" | "mailto" | "error";

export function ConnectForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [openedAt] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidationError(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    // Bots tend to fill hidden fields or submit instantly.
    if (data.get("website") || Date.now() - openedAt < 2500) {
      setStatus("done");
      return;
    }

    const name = String(data.get("name") || "").trim();
    const rawEmail = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (name.length < 2) {
      setValidationError("Please enter your full name.");
      return;
    }

    const emailCheck = normalizeEmail(rawEmail);
    if (!emailCheck.valid) {
      setValidationError(emailCheck.error || "Please enter a valid email address.");
      return;
    }

    const email = emailCheck.canonical;

    if (!ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio connection & resume request from ${name}`);
      const body = encodeURIComponent(
        `Hi Sujit,\n\nI'd love to connect and request a copy of your resume.\n\nName: ${name}\nEmail: ${email}${
          message ? `\nMessage: ${message}` : ""
        }`
      );
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
      form.reset();
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      // Apps Script web apps don't send CORS headers, so use no-cors with a
      // text/plain body. The response is opaque; we treat a sent request as success.
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          name,
          email,
          message,
          source: window.location.pathname,
        }),
      });
      form.reset();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-lg border border-violet-600/40 bg-zinc-950 p-6 text-sm leading-7 text-zinc-300">
        Thanks for reaching out. Check your inbox for my resume link (and your spam folder, just in case). I&rsquo;ll get back
        to you soon.
      </div>
    );
  }

  if (status === "mailto") {
    return (
      <div role="status" className="rounded-lg border border-violet-600/40 bg-zinc-950 p-6 text-sm leading-7 text-zinc-300">
        I&rsquo;ve opened a pre-filled email in your mail client to{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-violet-400 underline">
          {siteConfig.email}
        </a>
        . Send that over and I&rsquo;ll reply with my resume right away.
      </div>
    );
  }

  const field =
    "mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:border-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600/40";

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5" aria-describedby="connect-note" noValidate>
      <div>
        <label htmlFor="name" className="text-sm text-zinc-300">
          Name
        </label>
        <input id="name" name="name" required minLength={2} maxLength={100} autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="email" className="text-sm text-zinc-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={150}
          autoComplete="email"
          placeholder="you@company.com"
          className={field}
          onChange={() => {
            if (validationError) setValidationError(null);
          }}
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm text-zinc-300">
          Message <span className="text-zinc-500">(optional)</span>
        </label>
        <textarea id="message" name="message" rows={3} maxLength={1000} className={field} />
      </div>
      {/* Honeypot: hidden from people, visible to bots. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {validationError ? (
        <p role="alert" className="text-sm text-amber-400">
          {validationError}
        </p>
      ) : null}
      <p id="connect-note" className="text-xs leading-5 text-zinc-500">
        I&rsquo;ll use your details only to reply to you and send my resume. I won&rsquo;t share them.
      </p>
      <Button type="submit" size="lg" disabled={status === "sending"}>
        <Send className="mr-2 h-4 w-4" />
        {status === "sending" ? "Sending…" : "Connect & get my resume"}
      </Button>
      {status === "error" ? (
        <p role="alert" className="text-sm text-red-400">
          Something went wrong. Please email{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>{" "}
          directly instead.
        </p>
      ) : null}
    </form>
  );
}
