import { Resend } from 'resend';

// ── Interfaces ──────────────────────────────────────────────────────

export interface SendEmailOptions {
  /** Recipient email address */
  to: string | string[];
  /** Email subject line */
  subject: string;
  /** HTML body content */
  html: string;
  /** Optional plain-text fallback */
  text?: string;
  /** Optional reply-to address */
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  /** Resend message ID on success */
  messageId?: string;
  /** Error message on failure */
  error?: string;
}

// ── Resend Client ───────────────────────────────────────────────────

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

function getFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
}

// ── Base Utility ────────────────────────────────────────────────────

/**
 * Send a transactional email via Resend.
 *
 * Requires the following environment variables:
 *   RESEND_API_KEY   – your Resend API key
 *   RESEND_FROM_EMAIL – (optional) verified sender, defaults to noreply@syngov.app
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html, text, replyTo } = options;

  try {
    const { data, error } = await getResend().emails.send({
      from: getFromAddress(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(text && { text }),
      ...(replyTo && { reply_to: replyTo }),
    });

    if (error) {
      console.error('[SynGov Email] Resend API error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[SynGov Email] Unexpected error:', message);
    return { success: false, error: message };
  }
}
