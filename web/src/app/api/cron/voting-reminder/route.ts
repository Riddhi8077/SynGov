import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email/resend';
import { votingReminderTemplate } from '@/lib/email/templates';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://syn-3cqg104tf-bingi-dinesh-kumars-projects.vercel.app';

/**
 * GET /api/cron/voting-reminder
 *
 * Runs every hour via Vercel Cron.
 * 1. Finds proposals with deadlines within 24 hours that are still 'active'.
 * 2. Finds members who haven't voted yet.
 * 3. Sends them a reminder email.
 */
export async function GET(request: NextRequest) {
  // ── Protect with CRON_SECRET ─────────────────────────────
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // 1. Fetch active proposals closing within 24 hours
    const { data: urgentProposals, error: proposalError } = await supabase
      .from('proposals')
      .select('id, title, deadline')
      .eq('status', 'active')
      .gte('deadline', now.toISOString())
      .lte('deadline', in24Hours.toISOString());

    if (proposalError) {
      console.error('[Cron] Error fetching proposals:', proposalError.message);
      return NextResponse.json({ error: proposalError.message }, { status: 500 });
    }

    if (!urgentProposals || urgentProposals.length === 0) {
      return NextResponse.json({ message: 'No proposals closing within 24h', reminded: 0 });
    }

    // 2. Fetch all users
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, name, email');

    if (usersError || !allUsers) {
      console.error('[Cron] Error fetching users:', usersError?.message);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    let totalReminders = 0;

    for (const proposal of urgentProposals) {
      // 3. Fetch users who HAVE voted on this proposal
      const { data: existingVotes } = await supabase
        .from('votes')
        .select('user_id')
        .eq('proposal_id', proposal.id);

      const votedUserIds = new Set(existingVotes?.map(v => v.user_id) || []);

      // 4. Find members who HAVEN'T voted
      const nonVoters = allUsers.filter(u => !votedUserIds.has(u.id));

      if (nonVoters.length === 0) continue;

      // Calculate participation rate
      const participation = allUsers.length > 0
        ? Math.round((votedUserIds.size / allUsers.length) * 100)
        : 0;

      // Format deadline
      const deadlineDate = new Date(proposal.deadline);
      const deadlineStr = deadlineDate.toLocaleString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      }) + ' IST';

      // 5. Send reminder to each non-voter
      const emailResults = await Promise.allSettled(
        nonVoters.map(member =>
          sendEmail({
            to: member.email,
            subject: `⏰ Voting closes soon: ${proposal.title}`,
            html: votingReminderTemplate({
              memberName: member.name.split(' ')[0],
              proposalTitle: proposal.title,
              deadline: deadlineStr,
              currentParticipation: participation,
              voteUrl: `${APP_URL}/proposals`,
            }),
          })
        )
      );

      const sent = emailResults.filter(r => r.status === 'fulfilled').length;
      totalReminders += sent;
      console.log(`[Cron] Proposal "${proposal.title}": ${sent}/${nonVoters.length} reminders sent`);
    }

    return NextResponse.json({
      message: 'Voting reminders sent',
      proposalsChecked: urgentProposals.length,
      reminded: totalReminders,
    });
  } catch (err: any) {
    console.error('[Cron] Unexpected error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
