//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../interfaces/IPrivPoll.sol";
import "../base/SemaphoreCore.sol";
import "../base/SemaphoreGroups.sol";

/// @title Semaphore voting contract.
/// @dev The following code allows you to create polls, add voters and allow them to vote anonymously.
contract PrivPoll is IPrivPoll, SemaphoreCore, SemaphoreGroups {
    /// @dev Gets a tree depth and returns its verifier address.
    mapping(uint256 => IVerifier) internal verifiers;

    /// @dev Gets a poll id and returns the poll data.
    mapping(uint256 => Poll) internal polls;

    /// @dev Gets a nullifier hash and returns true or false.
    /// It is used to prevent double-voting.
    mapping(uint256 => bool) internal nullifierHashes;

    /// @dev Initializes the Semaphore verifiers used to verify the user's ZK proofs.
    /// @param _verifiers: List of Semaphore verifiers (address and related Merkle tree depth).
    constructor(Verifier[] memory _verifiers) {
        for (uint8 i = 0; i < _verifiers.length; ) {
            verifiers[_verifiers[i].merkleTreeDepth] = IVerifier(_verifiers[i].contractAddress);

            unchecked {
                ++i;
            }
        }
    }

    /// @dev Checks if the poll coordinator is the transaction sender.
    /// @param pollId: Id of the poll.
    modifier onlyCoordinator(uint256 pollId) {
        if (polls[pollId].coordinator != _msgSender()) {
            revert Semaphore__CallerIsNotThePollCoordinator();
        }

        _;
    }

    /// @dev See {ISemaphoreVoting-createPoll}.
    function createPoll(
        uint256 pollId,
        address coordinator,
        uint256 merkleRoot,
        uint256 merkleTreeDepth
    ) public override {
        if (address(verifiers[merkleTreeDepth]) == address(0)) {
            revert Semaphore__MerkleTreeDepthIsNotSupported();
        }

        _createGroup(pollId, merkleRoot, merkleTreeDepth, 0);

        Poll memory poll;

        poll.coordinator = coordinator;

        polls[pollId] = poll;

        emit PollCreated(pollId, coordinator);
    }

    /// @dev See {ISemaphoreVoting-castVote}.
    function castVote(
        bytes32 vote,
        uint256 nullifierHash,
        uint256 pollId,
        uint256[8] calldata proof
    ) public override {
        Poll memory poll = polls[pollId];

        if (poll.state != PollState.Ongoing) {
            revert Semaphore__PollIsNotOngoing();
        }

        if (nullifierHashes[nullifierHash]) {
            revert Semaphore__YouAreUsingTheSameNillifierTwice();
        }

        uint256 merkleTreeDepth = getMerkleTreeDepth(pollId);
        uint256 merkleTreeRoot = getMerkleTreeRoot(pollId);

        IVerifier verifier = verifiers[merkleTreeDepth];

        _verifyProof(vote, merkleTreeRoot, nullifierHash, pollId, proof, verifier);

        nullifierHashes[nullifierHash] = true;

        if (uint(vote) & 0xfff == 1) {
            polls[pollId].yesVotes += 1;
        } else {
            polls[pollId].noVotes += 1;
        }

        emit VoteAdded(pollId, vote);
    }

    /// @dev See {ISemaphoreVoting-publishDecryptionKey}.
    function endPoll(uint256 pollId) public override onlyCoordinator(pollId) returns (bool) {
        if (polls[pollId].state != PollState.Ongoing) {
            revert Semaphore__PollIsNotOngoing();
        }

        polls[pollId].state = PollState.Ended;

        emit PollEnded(pollId, _msgSender());

        return polls[pollId].yesVotes > polls[pollId].noVotes;
    }

    function getPollState(uint256 pollId) public view returns (uint256, uint256, string memory) {
        Poll memory poll = polls[pollId];

        if (poll.state == PollState.Ongoing) {
            return (poll.yesVotes, poll.noVotes, "Ongoing");
        } else {
            return (poll.yesVotes, poll.noVotes, "Ended");
        }
    }

}
