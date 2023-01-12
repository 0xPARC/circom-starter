//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

/// @title SemaphoreVoting interface.
/// @dev Interface of SemaphoreVoting contract.
interface IPrivPoll {
    error Semaphore__CallerIsNotThePollCoordinator();
    error Semaphore__MerkleTreeDepthIsNotSupported();
    error Semaphore__PollHasAlreadyBeenStarted();
    error Semaphore__PollIsNotOngoing();
    error Semaphore__YouAreUsingTheSameNillifierTwice();

    enum PollState {
        Ongoing,
        Ended
    }

    struct Verifier {
        address contractAddress;
        uint256 merkleTreeDepth;
    }

    struct Poll {
        address coordinator;
        PollState state;
        uint256 yesVotes;
        uint256 noVotes;
    }

    /// @dev Emitted when a new poll is created.
    /// @param pollId: Id of the poll.
    /// @param coordinator: Coordinator of the poll.
    event PollCreated(uint256 pollId, address indexed coordinator);

    /// @dev Emitted when a user votes on a poll.
    /// @param pollId: Id of the poll.
    /// @param vote: User vote.
    event VoteAdded(uint256 indexed pollId, bytes32 vote);

    /// @dev Emitted when a poll is ended.
    /// @param pollId: Id of the poll.
    /// @param coordinator: Coordinator of the poll.
    event PollEnded(uint256 pollId, address indexed coordinator);

    /// @dev Creates a poll and the associated Merkle tree/group.
    /// @param pollId: Id of the poll.
    /// @param coordinator: Coordinator of the poll.
    /// @param merkleRoot: Root of the tree.
    /// @param merkleTreeDepth: Depth of the tree.
    function createPoll(
        uint256 pollId,
        address coordinator,
        uint256 merkleRoot,
        uint256 merkleTreeDepth
    ) external;

    /// @dev Casts an anonymous vote in a poll.
    /// @param vote: Encrypted vote.
    /// @param nullifierHash: Nullifier hash.
    /// @param pollId: Id of the poll.
    /// @param proof: Private zk-proof parameters.
    function castVote(
        bytes32 vote,
        uint256 nullifierHash,
        uint256 pollId,
        uint256[8] calldata proof
    ) external;

    /// @dev Ends a pull and publishes the key to decrypt the votes.
    /// @param pollId: Id of the poll.
    function endPoll(uint256 pollId) external returns (bool);
}
