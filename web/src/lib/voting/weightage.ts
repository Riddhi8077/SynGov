import { supabase } from '@/lib/supabase';

// ── Interfaces ──────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  contribution_score: number;
  governance_weight: number;
  expertise_tags: string[];
}

export interface VoteRecord {
  vote_type: 'yes' | 'no' | 'abstain';
  final_weight: number;
}

export interface VoteResult {
  outcome: 'Passed' | 'Rejected';
  weightedYes: number;
  weightedNo: number;
  yesPercent: number;
  noPercent: number;
  approvalPercent: number;
  totalVotes: number;
  participationRate: number;
}

// ── Category → Expertise Tag Mapping ────────────────────────────────

const CATEGORY_TAG_MAP: Record<string, string[]> = {
  finance:    ['finance', 'accounting', 'budget', 'treasurer'],
  tech:       ['tech', 'engineering', 'development', 'coding'],
  events:     ['events', 'planning', 'logistics', 'outreach'],
  operations: ['operations', 'management', 'admin', 'hr'],
  general:    [],
};

// ── 1. Expertise Bonus ──────────────────────────────────────────────

/**
 * Returns 0.2 if any of the user's expertise_tags match the proposal
 * category, 0 otherwise.
 */
export function calculateExpertiseBonus(
  userTags: string[],
  proposalCategory: string
): number {
  const relevantTags = CATEGORY_TAG_MAP[proposalCategory.toLowerCase()] || [];
  if (relevantTags.length === 0) return 0;

  const normalizedUserTags = userTags.map(t => t.toLowerCase().trim());
  const hasMatch = relevantTags.some(tag => normalizedUserTags.includes(tag));

  return hasMatch ? 0.2 : 0;
}

// ── 2. Final Weight ─────────────────────────────────────────────────

/**
 * Calculates the final voting weight for a user on a specific proposal.
 *
 * Formula:
 *   base = contribution_score / 100
 *   final = clamp(base + expertiseBonus, 0.5, 2.0)
 */
export function calculateFinalWeight(
  contributionScore: number,
  expertiseBonus: number
): number {
  const base = contributionScore / 100;
  const raw = base + expertiseBonus;
  return Math.min(Math.max(raw, 0.5), 2.0);
}

// ── 3. Vote Result ──────────────────────────────────────────────────

/**
 * Takes all votes for a proposal, calculates weighted totals,
 * and determines the outcome using a 60% approval threshold.
 */
export function calculateVoteResult(
  votes: VoteRecord[],
  totalMembers: number
): VoteResult {
  let weightedYes = 0;
  let weightedNo = 0;
  let countedVotes = 0;

  for (const vote of votes) {
    if (vote.vote_type === 'yes') {
      weightedYes += vote.final_weight;
      countedVotes++;
    } else if (vote.vote_type === 'no') {
      weightedNo += vote.final_weight;
      countedVotes++;
    } else {
      // abstain — counts towards participation but not yes/no
      countedVotes++;
    }
  }

  const totalWeight = weightedYes + weightedNo;
  const approvalPercent = totalWeight > 0
    ? Math.round((weightedYes / totalWeight) * 100)
    : 0;

  const yesPercent = approvalPercent;
  const noPercent = totalWeight > 0 ? 100 - yesPercent : 0;

  const outcome: 'Passed' | 'Rejected' = approvalPercent >= 60 ? 'Passed' : 'Rejected';

  const participationRate = totalMembers > 0
    ? Math.round((votes.length / totalMembers) * 100)
    : 0;

  return {
    outcome,
    weightedYes: Math.round(weightedYes * 100) / 100,
    weightedNo: Math.round(weightedNo * 100) / 100,
    yesPercent,
    noPercent,
    approvalPercent,
    totalVotes: votes.length,
    participationRate,
  };
}

// ── 4. Update Contribution Score ────────────────────────────────────

/**
 * Logs an activity to the contribution_activity table and updates the
 * user's contribution_score in Supabase.
 * The DB trigger will automatically recalculate governance_weight.
 */
export async function updateContributionScore(
  userId: string,
  action: string,
  description: string,
  pointsChange: number,
  proposalId?: string
): Promise<void> {
  // 1. Log the activity
  await supabase.from('contribution_activity').insert([{
    user_id: userId,
    action,
    description,
    points_change: pointsChange,
    ...(proposalId && { proposal_id: proposalId }),
  }]);

  // 2. Fetch current score
  const { data: user } = await supabase
    .from('users')
    .select('contribution_score')
    .eq('id', userId)
    .single();

  if (!user) return;

  // 3. Update score (trigger recalculates governance_weight automatically)
  const newScore = Math.max(0, user.contribution_score + pointsChange);
  await supabase
    .from('users')
    .update({ contribution_score: newScore })
    .eq('id', userId);
}
