// ── Template Parameter Interfaces ───────────────────────────────────

export interface ProposalCreatedParams {
  /** Name of the proposal author */
  authorName: string;
  /** Title of the proposal */
  proposalTitle: string;
  /** AI-generated one-line summary */
  aiSummary: string;
  /** Category label (e.g. "Finance", "Tech") */
  category: string;
  /** Direct link to view the proposal */
  proposalUrl: string;
}

export interface VotingReminderParams {
  /** Recipient's first name */
  memberName: string;
  /** Title of the proposal */
  proposalTitle: string;
  /** Human-readable deadline (e.g. "June 12, 2026 at 5 PM IST") */
  deadline: string;
  /** Current participation percentage */
  currentParticipation: number;
  /** Direct link to vote */
  voteUrl: string;
}

export interface ProposalResultParams {
  /** Title of the proposal */
  proposalTitle: string;
  /** "Passed" | "Rejected" */
  outcome: 'Passed' | 'Rejected';
  /** Percentage of Yes votes */
  yesPercent: number;
  /** Percentage of No votes */
  noPercent: number;
  /** Total number of votes cast */
  totalVotes: number;
  /** Polygon transaction hash (optional) */
  txHash?: string;
  /** Direct link to view full results */
  resultsUrl: string;
}

// ── Shared Layout Helpers ───────────────────────────────────────────

const BRAND_BLUE = '#1D4ED8';
const BRAND_BLUE_LIGHT = '#DBEAFE';
const TEXT_PRIMARY = '#111827';
const TEXT_SECONDARY = '#6B7280';
const SUCCESS_GREEN = '#059669';
const DANGER_RED = '#DC2626';

function emailWrapper(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_BLUE};padding:28px 32px;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;">⚡ SynGov</h1>
              <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1px;">Decentralized Governance</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #E5E7EB;text-align:center;">
              <p style="margin:0;font-size:12px;color:${TEXT_SECONDARY};line-height:1.6;">
                You're receiving this because you're a member of a SynGov community.<br/>
                <a href="https://syngov.app" style="color:${BRAND_BLUE};text-decoration:none;">syngov.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function primaryButton(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
  <tr>
    <td style="border-radius:8px;background-color:${BRAND_BLUE};">
      <a href="${url}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:8px;">${label}</a>
    </td>
  </tr>
</table>`;
}

function badge(text: string, bgColor: string, textColor: string): string {
  return `<span style="display:inline-block;padding:4px 12px;font-size:12px;font-weight:700;color:${textColor};background-color:${bgColor};border-radius:99px;text-transform:uppercase;letter-spacing:0.5px;">${text}</span>`;
}

// ── Templates ───────────────────────────────────────────────────────

/**
 * Email sent to all community members when a new proposal is created.
 */
export function proposalCreatedTemplate(params: ProposalCreatedParams): string {
  const { authorName, proposalTitle, aiSummary, category, proposalUrl } = params;

  const body = `
    <p style="margin:0 0 4px;font-size:13px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">New Proposal</p>
    <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:${TEXT_PRIMARY};line-height:1.3;">${proposalTitle}</h2>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_BLUE_LIGHT};border-radius:8px;padding:0;margin-bottom:20px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:${BRAND_BLUE};text-transform:uppercase;letter-spacing:0.5px;">✨ AI Summary</p>
          <p style="margin:0;font-size:14px;color:${TEXT_PRIMARY};line-height:1.5;">${aiSummary}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      <tr>
        <td style="padding-right:12px;font-size:13px;color:${TEXT_SECONDARY};">Author</td>
        <td style="font-size:13px;font-weight:600;color:${TEXT_PRIMARY};">${authorName}</td>
      </tr>
      <tr>
        <td style="padding-right:12px;font-size:13px;color:${TEXT_SECONDARY};padding-top:8px;">Category</td>
        <td style="padding-top:8px;">${badge(category, BRAND_BLUE_LIGHT, BRAND_BLUE)}</td>
      </tr>
    </table>

    ${primaryButton('View Proposal & Vote', proposalUrl)}

    <p style="margin:0;font-size:13px;color:${TEXT_SECONDARY};text-align:center;">Your vote matters. Every voice shapes the outcome.</p>
  `;

  return emailWrapper(body);
}

/**
 * Reminder email sent to members who haven't voted yet before the deadline.
 */
export function votingReminderTemplate(params: VotingReminderParams): string {
  const { memberName, proposalTitle, deadline, currentParticipation, voteUrl } = params;

  const progressWidth = Math.min(Math.max(currentParticipation, 5), 100);

  const body = `
    <p style="margin:0 0 16px;font-size:15px;color:${TEXT_PRIMARY};line-height:1.5;">
      Hi <strong>${memberName}</strong>, you haven't cast your vote yet on:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;margin-bottom:20px;">
      <tr>
        <td style="padding:16px 20px;">
          <h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:${TEXT_PRIMARY};">${proposalTitle}</h3>
          <p style="margin:0;font-size:13px;color:${TEXT_SECONDARY};">
            ⏰ Voting closes: <strong style="color:${DANGER_RED};">${deadline}</strong>
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;">Community Participation</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:6px;">
      <tr>
        <td style="background-color:#E5E7EB;border-radius:4px;height:8px;">
          <div style="width:${progressWidth}%;height:8px;background-color:${BRAND_BLUE};border-radius:4px;"></div>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:${BRAND_BLUE};">${currentParticipation}% have voted</p>

    ${primaryButton('Cast Your Vote Now', voteUrl)}

    <p style="margin:0;font-size:13px;color:${TEXT_SECONDARY};text-align:center;">Weighted voting means your expertise counts.</p>
  `;

  return emailWrapper(body);
}

/**
 * Results notification sent to all members after voting concludes.
 */
export function proposalResultTemplate(params: ProposalResultParams): string {
  const { proposalTitle, outcome, yesPercent, noPercent, totalVotes, txHash, resultsUrl } = params;

  const isPassed = outcome === 'Passed';
  const outcomeColor = isPassed ? SUCCESS_GREEN : DANGER_RED;
  const outcomeBg = isPassed ? '#D1FAE5' : '#FEE2E2';
  const outcomeEmoji = isPassed ? '✅' : '❌';

  const body = `
    <div style="text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Voting Complete</p>
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:${TEXT_PRIMARY};line-height:1.3;">${proposalTitle}</h2>
      ${badge(`${outcomeEmoji} ${outcome}`, outcomeBg, outcomeColor)}
    </div>

    <!-- Vote Breakdown -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;margin-bottom:20px;">
      <tr>
        <td style="padding:20px;">
          <!-- Progress Bar -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
            <tr>
              <td style="width:${yesPercent}%;height:10px;background-color:${SUCCESS_GREEN};border-radius:4px 0 0 4px;"></td>
              <td style="width:${noPercent}%;height:10px;background-color:${DANGER_RED};border-radius:0 4px 4px 0;"></td>
            </tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:14px;font-weight:700;color:${SUCCESS_GREEN};">👍 ${yesPercent}% Yes</td>
              <td style="font-size:14px;font-weight:700;color:${DANGER_RED};text-align:right;">👎 ${noPercent}% No</td>
            </tr>
          </table>
          <p style="margin:12px 0 0;font-size:13px;color:${TEXT_SECONDARY};text-align:center;">${totalVotes} total votes cast</p>
        </td>
      </tr>
    </table>

    ${txHash ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;border-radius:8px;margin-bottom:20px;">
      <tr>
        <td style="padding:12px 16px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;">🔗 On-Chain Record (Polygon)</p>
          <p style="margin:0;font-size:12px;font-family:monospace;color:${BRAND_BLUE};word-break:break-all;">
            <a href="https://polygonscan.com/tx/${txHash}" style="color:${BRAND_BLUE};text-decoration:none;">${txHash.substring(0, 18)}...${txHash.substring(txHash.length - 12)}</a>
          </p>
        </td>
      </tr>
    </table>
    ` : ''}

    ${primaryButton('View Full Results', resultsUrl)}

    <p style="margin:0;font-size:13px;color:${TEXT_SECONDARY};text-align:center;">This decision is permanently recorded on Polygon.</p>
  `;

  return emailWrapper(body);
}
