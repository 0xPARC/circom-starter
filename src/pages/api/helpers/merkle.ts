import prisma from '../../../lib/prisma';
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'

// Creates a merkle tree and stores the result inside of the database!
// Returns the root hash of the merkle tree and the poll id
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

// Checks if some address is in specified merkle tree!
export async function verifyAddressInTree(address: string, pollId: number) {

    const data = await getTreeFromPollId(pollId)
    if (data.tree == null) {
        return {isValidPollId: false, inTree: false}
    }
    var tree = data.tree
    var merkleTree = new MerkleTree(tree.leaves, keccak256)
    const proof = merkleTree.getProof(address)
    return {isValidPollId: true, inTree: merkleTree.verify(proof, address, merkleTree.getRoot())}
}

// Returns merkle tree
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

// Can delete later!
async function displayMerkleRoot() {
    // ... you will write your Prisma Client queries here


    var leaves = ["0xAAB27b150451726EC7738aa1d0A94505c8729bd1",
            "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
            "0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5"]
    var tree = new MerkleTree(leaves, keccak256)
    var root = tree.getRoot().toString('hex')
    // console.log(root)
    return root

}