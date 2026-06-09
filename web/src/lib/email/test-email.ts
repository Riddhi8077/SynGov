// Quick test script for Resend email integration
// Run with: npx tsx src/lib/email/test-email.ts your@email.com

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually (no dotenv dependency needed)
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx);
  const val = trimmed.slice(eqIdx + 1);
  if (!process.env[key]) process.env[key] = val;
}

import { sendEmail } from './resend';
import { proposalCreatedTemplate } from './templates';

async function main() {
  const to = process.argv[2];

  if (!to) {
    console.error('❌ Usage: npx tsx src/lib/email/test-email.ts your@email.com');
    process.exit(1);
  }

  console.log(`📧 Sending test email to: ${to}`);

  const html = proposalCreatedTemplate({
    authorName: 'Dinesh Kumar',
    proposalTitle: 'Allocate ₹20K for Annual Hackathon',
    aiSummary: 'Requesting ₹20,000 for prizes, food, and venue for the upcoming 24-hour community hackathon. Medium risk, high community impact.',
    category: 'Finance',
    proposalUrl: 'https://syn-3cqg104tf-bingi-dinesh-kumars-projects.vercel.app/proposals',
  });

  const result = await sendEmail({
    to,
    subject: '🚀 [SynGov Test] New Proposal Created',
    html,
  });

  if (result.success) {
    console.log(`✅ Email sent successfully! Message ID: ${result.messageId}`);
    console.log('📬 Check your inbox (and spam folder).');
  } else {
    console.error(`❌ Failed to send: ${result.error}`);
  }
}

main();
