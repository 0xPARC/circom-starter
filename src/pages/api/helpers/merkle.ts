import prisma from '../../../lib/prisma';
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'

// Creates a merkle tree and stores the result inside of the database!
// Returns the root hash of the merkle tree and the poll id
export default async function storePoll(title: string, description: string, groupDescription: string, createdAt: number, deadline: number, addresses: string[]) {
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