//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import {SNARK_SCALAR_FIELD} from "./SemaphoreConstants.sol";
import "../interfaces/ISemaphoreGroups.sol";
import "@zk-kit/incremental-merkle-tree.sol/IncrementalBinaryTree.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/// @title Semaphore groups contract.
/// @dev The following code allows you to create groups, add and remove members.
/// You can use getters to obtain informations about groups (root, depth, number of leaves).
abstract contract SemaphoreGroups is Context, ISemaphoreGroups {
    /// @dev Gets a group id and returns the root.
    mapping(uint256 => uint256) internal roots;
    /// @dev Depth of the merkle tree.
    mapping(uint256 => uint256) internal depths;

    /// @dev Creates a new group by setting the merkle root of the tree.
    /// @param groupId: Id of the group.
    /// @param merkleTreeRoot: Merkle tree root.
    /// @param merkleTreeDepth: Merkle tree depth.
    /// @param zeroValue: Zero value of the tree.
    function _createGroup(
        uint256 groupId,
        uint256 merkleTreeRoot,
        uint256 merkleTreeDepth,
        uint256 zeroValue
    ) internal virtual {
        if (groupId >= SNARK_SCALAR_FIELD) {
            revert Semaphore__GroupIdIsNotLessThanSnarkScalarField();
        }

        roots[groupId] = merkleTreeRoot;
        depths[groupId] = merkleTreeDepth;
        
        emit GroupCreated(groupId, merkleTreeDepth, zeroValue);
    }

    /// @dev See {ISemaphoreGroups-getMerkleTreeRoot}.
    function getMerkleTreeRoot(uint256 groupId) public view virtual override returns (uint256) {
        return roots[groupId];
    }

    /// @dev See {ISemaphoreGroups-getMerkleTreeDepth}.
    function getMerkleTreeDepth(uint256 groupId) public view virtual override returns (uint256) {
        return depths[groupId];
    }
}
