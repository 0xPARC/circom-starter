import prisma from '../../../lib/prisma';
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'

/** 
 * @function: storePoll
 * @description: This function creates a merkle tree and stores the result inside of the database.
 * @returns {string} root - The root hash of the merkle tree created.
 * @returns {number} pollId - The poll id of the poll that was created.
 */
export async function storePoll(title: string, description: string, groupDescription: string, createdAt: number, deadline: number, addresses: string[]) {
    var title = title
    var description = description
    var groupDescription = groupDescription
    var dateCreatedAt = new Date(createdAt)
    var dateDeadline = new Date(deadline)

    // TODO: CONFIRM THAT ADDRESSES ARE VALID (Molly will probs take care of this)
    var tree = new MerkleTree(addresses, keccak256)
    var root = tree.getRoot().toString('hex')

    var poll = await prisma.poll.create({
        data : {
            title: title,
            description: description,
            groupDescription: groupDescription,
            createdAt: dateCreatedAt,
            deadline: dateDeadline,
            tree: {
                create: {
                    rootHash: root,
                    leaves: addresses,
                }
                
            }
        }
    })
    const allPolls = await prisma.poll.findMany({
        include: {
          tree: true,
        },
    })
    // Print all polls!
    console.dir(allPolls, { depth: null })

    return {rootHash: root, pollId: poll.id}
}

/** 
 * @function: verifyAddressInTree
 * @description: This function verifies if an address is in a merkle tree.
 * @returns {MerkleTree} tree - The merkle tree that was created.
 * @returns {boolean} isValidPollId - Whether or not the poll id is valid.
 * @returns {number} inTree - Whether or not the address is in the tree.
 */
export async function verifyAddressInTree(address: string, pollId: number) {

    const data = await getTreeFromPollId(pollId)
    if (data.tree == null) {
        return {isValidPollId: false, inTree: false}
    }
    var tree = data.tree
    var merkleTree = new MerkleTree(tree.leaves, keccak256)
    // console.log(MerkleTree.marshalTree(merkleTree))
    const proof = merkleTree.getProof(address)
    // console.log(address)
    // console.log(MerkleTree.marshalProof(proof))
    var inTree = merkleTree.verify(proof, address, merkleTree.getRoot())
    // console.log(inTree)
    return {tree: merkleTree, isValidPollId: true, inTree: inTree}
}

/** 
 * @function: getSiblingsAndPathIndices
 * @description: This function gets the siblings and path indices of an address in a merkle tree for the verifier & generator.
 * @returns {boolean} isValidPollId - Whether or not the poll id is valid.
 * @returns {[]string} siblings - The siblings of the address in the merkle tree.
 * @returns {[]number} pathIndices - The path indices of the siblings {0, 1} (sibling on right, sibling on left).
 */
export async function getSiblingsAndPathIndices(address: string, pollId: number) {
    const data = await getTreeFromPollId(pollId)
    if (data.tree == null) {
        return {isValidPollId: false, siblings: [], pathIndices: []}
    }
    var tree = data.tree
    var merkleTree = new MerkleTree(tree.leaves, keccak256)
    const proof = merkleTree.getProof(address)
    var siblings = []
    var pathIndices = []
    for (var i = 0; i < proof.length; i++) {
        var siblingHash = proof[i].data.toString('hex')
        siblings.push(siblingHash)
        // If left 0, if right 1
        var pathIndex = proof[i].position == 'left' ? 1 : 0
        pathIndices.push(pathIndex)
    }
    return {isValidPollId: true, siblings: siblings, pathIndices: pathIndices}
}

/** 
 * @function: getSiblingsAndPathIndices
 * @description: This function gets the siblings and path indices of an address in a merkle tree for the verifier & generator.
 * @returns {number} pollId - Poll id of the poll that was created.
 * @returns {[]string} tree - The merkle tree that was created.
 */
async function getTreeFromPollId(pollId: number) {

    const tree = await prisma.merkleTree.findUnique({
        where: {
            id: pollId
        },
    })
    // Print all polls!
    // console.dir(tree, { depth: null })

    return {tree: tree, pollId: pollId}
}