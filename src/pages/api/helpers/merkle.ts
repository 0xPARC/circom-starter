import prisma from '../../../lib/prisma';
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'

export default async function storePoll() {
    var title = "test"
    var description = "testDesc"
    var groupDescription = "testGroupDesc"
    var createdAt = new Date()
    var deadline = new Date()

    var leaves = ["0xAAB27b150451726EC7738aa1d0A94505c8729bd1",
            "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
            "0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5"]
    var tree = new MerkleTree(leaves, keccak256)
    var root = tree.getRoot().toString('hex')

    var root = await displayMerkleRoot()
    await prisma.poll.create({
        data : {
            title: title,
            description: description,
            groupDescription: groupDescription,
            createdAt: createdAt,
            deadline: deadline,
            tree: {
                create: {
                    rootHash: root,
                    leaves: leaves,
                }
                
            }
        }
    })
    const allUsers = await prisma.poll.findMany({
        include: {
          tree: true,
        },
    })
    console.dir(allUsers, { depth: null })
    return root
}
async function displayMerkleRoot() {
    // ... you will write your Prisma Client queries here


    var leaves = ["0xAAB27b150451726EC7738aa1d0A94505c8729bd1",
            "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
            "0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5"]
    var tree = new MerkleTree(leaves, keccak256)
    var root = tree.getRoot().toString('hex')
    // console.log(root)
    return root

    // await prisma.$disconnect().catch(
    //     async (e) => {
    //         console.error(e); 
    //         await prisma.$disconnect(); 
    //         process.exit(1)
    // }).then(
        
    // )

    // var poll = await prisma.poll.create({
    //     data : {
    //         title: title,
    //         description: description,
    //         groupDescription: groupDescription,
    //         createdAt: createdAt,
    //         deadline: deadline,
    //         tree: {
    //             rootHash: root,
    //             leaves: leaves,
    //             pollId: 0,
    //         }
    //     }
    // })

}

// displayMerkleRoot()
//     .then(async () => {
//     await prisma.$disconnect()
//     })
//     .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
// })