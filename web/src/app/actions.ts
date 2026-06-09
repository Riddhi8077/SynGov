'use server'

import { GoogleGenAI } from '@google/genai'
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { ethers } from 'ethers'
import { sendEmail } from '@/lib/email/resend'
import { proposalCreatedTemplate, proposalResultTemplate } from '@/lib/email/templates'
import {
  calculateExpertiseBonus,
  calculateFinalWeight,
  calculateVoteResult,
  updateContributionScore,
} from '@/lib/voting/weightage'

// ── Gemini SDK ──────────────────────────────────────────────
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

// ── Web3 Setup ──────────────────────────────────────────────
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545')
const wallet = new ethers.Wallet(
  process.env.RELAYER_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  provider
)
const contractABI = [
  "function logVote(string proposalId, string userIdHash, string voteType, string weightUsed) public",
  "function logProposal(string proposalId, string titleHash) public"
]
const contractAddress = process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const loggerContract = new ethers.Contract(contractAddress, contractABI, wallet)

// ── App URL ─────────────────────────────────────────────────
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://syn-3cqg104tf-bingi-dinesh-kumars-projects.vercel.app'

// ── Helper: fetch all member emails ─────────────────────────
async function getAllMemberEmails(): Promise<{ email: string; name: string }[]> {
  const { data, error } = await supabase.from('users').select('email, name')
  if (error || !data) {
    console.error('[SynGov] Failed to fetch member emails:', error?.message)
    return []
  }
  return data
}

// ── Helper: non-blocking email blast ────────────────────────
async function notifyAllMembers(subject: string, htmlFn: (member: { email: string; name: string }) => string) {
  const members = await getAllMemberEmails()
  if (members.length === 0) return

  Promise.allSettled(
    members.map(member =>
      sendEmail({ to: member.email, subject, html: htmlFn(member) })
    )
  ).then(results => {
    const failed = results.filter(r => r.status === 'rejected').length
    if (failed > 0) console.error(`[SynGov Email] ${failed}/${members.length} emails failed`)
    else console.log(`[SynGov Email] ${members.length} emails sent successfully`)
  })
}

// ═══════════════════════════════════════════════════════════════
// 1. GENERATE PROPOSAL SUMMARY (Gemini AI)
// ═══════════════════════════════════════════════════════════════

export async function generateProposalSummary(
  description: string,
  title: string,
  budget: string,
  timeline: string
) {
  try {
    const prompt = `
      You are an expert financial and operational analyst for a college governance system. 
      Read the following proposal and synthesize the information into a high-level executive summary.
      DO NOT simply repeat the user's text verbatim. You must condense, analyze, and rephrase the core points intelligently.
      
      Title: ${title}
      Budget: ${budget}
      Timeline: ${timeline}
      Description:
      ${description}
      
      Extract the following and return ONLY a valid JSON object with these exact keys:
      {
        "what": "In your own words, a highly condensed 1-sentence summary of the core objective.",
        "why": "In your own words, a 1-sentence analysis of the true underlying value or problem this solves.",
        "cost": "The exact budget amount, cleaned up (e.g. '₹15,000'). If none, write 'None'.",
        "impact": "A critical 1-sentence assessment of the realistic outcome.",
        "risk": "A single word: 'low', 'medium', or 'high', based on your analysis of the budget and scope.",
        "deadline": "The expected timeline.",
        "affects": "Analyze who will actually feel the impact of this (e.g., '30+ coding club members')."
      }
    `

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    })

    if (response.text) {
      return JSON.parse(response.text)
    }
    throw new Error("No response from Gemini")
  } catch (error) {
    console.error("Error generating summary:", error)
    throw error
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. CREATE PROPOSAL + Email Notification
// ═══════════════════════════════════════════════════════════════

export async function createProposal(data: any) {
  try {
    // 1. Insert into Supabase
    const { data: result, error } = await supabase.from('proposals').insert([{
      title: data.title,
      category: data.category,
      budget: data.budget,
      timeline: data.timeline,
      risk_level: data.riskLevel,
      deadline: data.deadline,
      description: data.description,
      ai_summary: data.aiSummary,
      author_id: data.authorId || null,
      status: 'active'
    }]).select()

    if (error) throw error

    // 2. Log to blockchain
    try {
      const tx = await loggerContract.logProposal(result[0].id, data.title.substring(0, 32))
      console.log('Proposal logged to blockchain. Tx Hash:', tx.hash)
    } catch (e: any) {
      console.log('Web3 logging failed:', e.message)
    }

    // 3. Award contribution points to the author
    if (data.authorId) {
      await updateContributionScore(
        data.authorId,
        'proposal_created',
        `Created proposal: ${data.title}`,
        10,
        result[0].id
      )
    }

    // 4. Notify all members via email
    const aiWhat = data.aiSummary?.what || data.description?.substring(0, 120) || data.title
    notifyAllMembers(
      `📋 New Proposal: ${data.title}`,
      () => proposalCreatedTemplate({
        authorName: data.authorName || 'A community member',
        proposalTitle: data.title,
        aiSummary: aiWhat,
        category: data.category || 'general',
        proposalUrl: `${APP_URL}/proposals`,
      })
    )

    revalidatePath('/dashboard')
    revalidatePath('/proposals')
    return { success: true, id: result[0].id }
  } catch (err: any) {
    throw new Error(err.message)
  }
}

// ═══════════════════════════════════════════════════════════════
// 3. CAST VOTE ACTION
// ═══════════════════════════════════════════════════════════════

export interface CastVoteResult {
  success: boolean;
  finalWeight: number;
  expertiseBonus: number;
  weightedYes: number;
  weightedNo: number;
  error?: string;
}

export async function castVoteAction(
  proposalId: string,
  userId: string,
  voteType: 'yes' | 'no' | 'abstain'
): Promise<CastVoteResult> {
  try {
    // ── 1. Fetch the user ──────────────────────────────────
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, name, contribution_score, governance_weight, expertise_tags')
      .eq('id', userId)
      .single()

    if (userErr || !user) {
      return { success: false, finalWeight: 0, expertiseBonus: 0, weightedYes: 0, weightedNo: 0, error: 'User not found' }
    }

    // ── 2. Fetch the proposal ──────────────────────────────
    const { data: proposal, error: propErr } = await supabase
      .from('proposals')
      .select('id, title, category, status, weighted_yes, weighted_no')
      .eq('id', proposalId)
      .single()

    if (propErr || !proposal) {
      return { success: false, finalWeight: 0, expertiseBonus: 0, weightedYes: 0, weightedNo: 0, error: 'Proposal not found' }
    }

    // ── 3. Block closed proposals ──────────────────────────
    if (proposal.status !== 'active') {
      return { success: false, finalWeight: 0, expertiseBonus: 0, weightedYes: 0, weightedNo: 0, error: 'Voting is closed on this proposal' }
    }

    // ── 4. Block duplicate votes ───────────────────────────
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('proposal_id', proposalId)
      .eq('user_id', userId)
      .single()

    if (existingVote) {
      return { success: false, finalWeight: 0, expertiseBonus: 0, weightedYes: 0, weightedNo: 0, error: 'You have already voted on this proposal' }
    }

    // ── 5. Calculate weights ───────────────────────────────
    const expertiseBonus = calculateExpertiseBonus(
      user.expertise_tags || [],
      proposal.category || 'general'
    )
    const finalWeight = calculateFinalWeight(user.contribution_score, expertiseBonus)
    const baseWeight = user.contribution_score / 100

    // ── 6. Insert vote ─────────────────────────────────────
    const { error: voteError } = await supabase.from('votes').insert([{
      proposal_id: proposalId,
      user_id: userId,
      vote_type: voteType,
      base_weight: Math.min(Math.max(baseWeight, 0.5), 2.0),
      expertise_bonus: expertiseBonus,
      final_weight: finalWeight,
    }])

    if (voteError) {
      return { success: false, finalWeight: 0, expertiseBonus: 0, weightedYes: 0, weightedNo: 0, error: voteError.message }
    }

    // ── 7. Update weighted totals on proposal ──────────────
    let newWeightedYes = parseFloat(proposal.weighted_yes) || 0
    let newWeightedNo = parseFloat(proposal.weighted_no) || 0

    if (voteType === 'yes') {
      newWeightedYes += finalWeight
    } else if (voteType === 'no') {
      newWeightedNo += finalWeight
    }
    // abstain doesn't add to yes/no

    await supabase
      .from('proposals')
      .update({ weighted_yes: newWeightedYes, weighted_no: newWeightedNo })
      .eq('id', proposalId)

    // ── 8. Log to blockchain ───────────────────────────────
    try {
      const tx = await loggerContract.logVote(proposalId, userId, voteType, finalWeight.toString())
      console.log('Vote logged to blockchain. Tx Hash:', tx.hash)
    } catch (e: any) {
      console.log('Web3 logging failed:', e.message)
    }

    // ── 9. Award contribution points ───────────────────────
    await updateContributionScore(
      userId,
      'vote_cast',
      `Voted ${voteType} on: ${proposal.title}`,
      5,
      proposalId
    )

    revalidatePath('/dashboard')
    revalidatePath('/proposals')

    return {
      success: true,
      finalWeight,
      expertiseBonus,
      weightedYes: Math.round(newWeightedYes * 100) / 100,
      weightedNo: Math.round(newWeightedNo * 100) / 100,
    }
  } catch (err: any) {
    return { success: false, finalWeight: 0, expertiseBonus: 0, weightedYes: 0, weightedNo: 0, error: err.message }
  }
}

// ═══════════════════════════════════════════════════════════════
// 4. CLOSE VOTING + Blockchain + Email
// ═══════════════════════════════════════════════════════════════

export interface CloseVotingResult {
  success: boolean;
  outcome?: 'Passed' | 'Rejected';
  yesPercent?: number;
  noPercent?: number;
  totalVotes?: number;
  participationRate?: number;
  txHash?: string;
  error?: string;
}

export async function closeVotingAction(proposalId: string): Promise<CloseVotingResult> {
  try {
    // ── 1. Fetch the proposal ──────────────────────────────
    const { data: proposal, error: pErr } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single()

    if (pErr || !proposal) {
      return { success: false, error: 'Proposal not found' }
    }

    if (proposal.status !== 'active') {
      return { success: false, error: 'Voting is already closed' }
    }

    // ── 2. Fetch all votes ─────────────────────────────────
    const { data: votes } = await supabase
      .from('votes')
      .select('vote_type, final_weight')
      .eq('proposal_id', proposalId)

    // ── 3. Get total member count ──────────────────────────
    const { count: totalMembers } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })

    // ── 4. Calculate result ────────────────────────────────
    const result = calculateVoteResult(
      (votes || []) as { vote_type: 'yes' | 'no' | 'abstain'; final_weight: number }[],
      totalMembers || 0
    )

    // ── 5. Log to blockchain ───────────────────────────────
    let txHash: string | undefined
    try {
      const tx = await loggerContract.logProposal(
        proposalId,
        `RESULT:${result.outcome}:${result.approvalPercent}%`
      )
      await tx.wait()
      txHash = tx.hash
      console.log('Result logged to blockchain. Tx Hash:', txHash)
    } catch (e: any) {
      console.log('Web3 logging failed:', e.message)
    }

    // ── 6. Update proposal in Supabase ─────────────────────
    const newStatus = result.outcome === 'Passed' ? 'passed' : 'rejected'
    await supabase
      .from('proposals')
      .update({
        status: newStatus,
        tx_hash: txHash || null,
        weighted_yes: result.weightedYes,
        weighted_no: result.weightedNo,
      })
      .eq('id', proposalId)

    // ── 7. Send result email to all members ────────────────
    notifyAllMembers(
      `${result.outcome === 'Passed' ? '✅' : '❌'} Proposal ${result.outcome}: ${proposal.title}`,
      () => proposalResultTemplate({
        proposalTitle: proposal.title,
        outcome: result.outcome,
        yesPercent: result.yesPercent,
        noPercent: result.noPercent,
        totalVotes: result.totalVotes,
        txHash,
        resultsUrl: `${APP_URL}/proposals`,
      })
    )

    // ── 8. Deduct points from non-voters ───────────────────
    const { data: allUsers } = await supabase.from('users').select('id')
    const votedUserIds = new Set((votes || []).map((v: any) => v.user_id))

    if (allUsers) {
      // We need the user_id from votes, so re-fetch with user_id
      const { data: votesWithUsers } = await supabase
        .from('votes')
        .select('user_id')
        .eq('proposal_id', proposalId)

      const votedIds = new Set((votesWithUsers || []).map(v => v.user_id))

      const nonVoters = allUsers.filter(u => !votedIds.has(u.id))

      await Promise.allSettled(
        nonVoters.map(u =>
          updateContributionScore(
            u.id,
            'missed_vote',
            `Did not vote on: ${proposal.title}`,
            -3,
            proposalId
          )
        )
      )
    }

    revalidatePath('/dashboard')
    revalidatePath('/proposals')

    return {
      success: true,
      outcome: result.outcome,
      yesPercent: result.yesPercent,
      noPercent: result.noPercent,
      totalVotes: result.totalVotes,
      participationRate: result.participationRate,
      txHash,
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
