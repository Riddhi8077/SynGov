// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SynGovLogger
 * @dev A lightweight governance logger for recording SynGov proposals and votes immutably on-chain.
 * Used to provide transparent, tamper-proof logs for student communities.
 */
contract SynGovLogger is Ownable {
    // Events that will be emitted and stored permanently on the blockchain
    event ProposalCreated(string proposalId, string titleHash, address createdBy, uint256 timestamp);
    event VoteCast(string proposalId, string userIdHash, string voteType, string weightUsed, uint256 timestamp);

    // Initialize Ownable with the deployer address as the initial owner
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Log a new proposal creation on-chain
     * @param proposalId The UUID from Supabase
     * @param titleHash The Keccak256 hash or plain string of the proposal title
     */
    function logProposal(string memory proposalId, string memory titleHash) public onlyOwner {
        emit ProposalCreated(proposalId, titleHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Log a user vote on-chain
     * @param proposalId The UUID of the proposal voted on
     * @param userIdHash Anonymized hash of the user voting
     * @param voteType 'for', 'against', or 'abstain'
     * @param weightUsed The multiplier (e.g., "1.2x") applied to the vote
     */
    function logVote(
        string memory proposalId,
        string memory userIdHash,
        string memory voteType,
        string memory weightUsed
    ) public onlyOwner {
        emit VoteCast(proposalId, userIdHash, voteType, weightUsed, block.timestamp);
    }
}
