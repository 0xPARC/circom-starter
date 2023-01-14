import prisma from '../lib/prisma';
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import { buildTreePoseidon, verifyInTree } from './merklePoseidon';
import axios from 'axios'
import build from 'next/dist/build';
// const buildPoseidon = require("circomlibjs").buildPoseidon;

// /**
//  * Custom poseidon hash function that hashes strings.
//  * @returns {Promise<Function>} poseidon - The poseidon hash function.
//  */
// const buildCustomPoseidon = async (): Promise<Function> => {
//     const poseidon = await buildPoseidon();
//     return (x: string[]) => {
//         const hashString = poseidon.F.toString(poseidon(x));
//         // console.log(parseInt(hashString).toString(16))
//         // const hexOfString = Buffer.from(x, 'utf8').toString('hex');
//         // const bigIntOfString = BigInt("0x" + hexOfString);
//         // const poseidonHashOutput = poseidon([bigIntOfString]);
//         // console.log(poseidonHashOutput);
//         // console.log(parseInt(poseidon.F.toString(poseidonHashOutput)).toString(16))
//         // return poseidonHashOutput;
//         return hashString
//     }
// }

/** 
 * @function: storePoll
 * @description: This function creates a merkle tree and stores the result inside of the database.
 * @returns {BigInt} root - The root hash of the merkle tree created.
 * @returns {number} pollId - The poll id of the poll that was created.
 */
export async function createPoseidonTree(addresses: string[]) {

    // Handles arbitrary input!
    var tree = await buildTreePoseidon(addresses)

    // console.log("GETS HERE")

    // console.log(tree.root)

    var rootString = tree.root.toString()

    console.log("rootString", rootString)

    return {rootHash: rootString}
}

/** 
 * @function: verifyAddressInTree
 * @description: This function verifies if an address is in a merkle tree.
 * @returns {boolean} isValidPollId - Whether or not the poll id is valid.
 * @returns {number} inTree - Whether or not the address is in the tree.
 */
export async function verifyAddressInTree(address: string, pollId: number) {

    const response = await axios.post("/api/getTree", {pollId: pollId});
    if (response.data.tree == null) {
        return {isValidPollId: false, siblings: [], pathIndices: []}
    }
    var tree = response.data.tree;
    var merkleTree = await buildTreePoseidon(tree.leaves)
    var BigIntAddress = BigInt(address).toString()
    var inTree = await verifyInTree(merkleTree.root.toString(), address, merkleTree.leafToPathElements[BigIntAddress], merkleTree.leafToPathIndices[BigIntAddress])
    // console.log("inTree", inTree)
    // var inTree = merkleTree.verify(proof, address, merkleTree.getRoot())
    return {isValidPollId: true, inTree: inTree}
}

/** 
 * @function: getSiblingsAndPathIndices
 * @description: This function gets the siblings and path indices of an address in a merkle tree for the verifier & generator.
 * @returns {boolean} isValidPollId - Whether or not the poll id is valid.
 * @returns {[]string} siblings - The siblings of the address in the merkle tree.
 * @returns {[]number} pathIndices - The path indices of the siblings {0, 1} (sibling on right, sibling on left).
 */
export async function getSiblingsAndPathIndices(address: string, pollId: number) {
    const response = await axios.post("/api/getTree", {pollId: pollId});
    if (response.data.tree == null) {
        return {isValidPollId: false, siblings: [], pathIndices: []}
    }
    var tree = response.data.tree;
    var merkleTree = await buildTreePoseidon(tree.leaves)
    console.log(merkleTree.leafToPathElements)
    console.log(merkleTree.leafToPathIndices)


    // const proof = merkleTree.getProof(address)
    // var siblings = []
    // var pathIndices = []
    // for (var i = 0; i < proof.length; i++) {
    //     var siblingHash = proof[i].data.toString('hex')
    //     siblings.push(siblingHash)
    //     // If left 0, if right 1
    //     var pathIndex = proof[i].position == 'left' ? 1 : 0
    //     pathIndices.push(pathIndex)
    // }
    
    var siblings = []
    // console.log(await merkleTree.leafToPathIndices.length)
    // console.log(merkleTree.leafToPathElements[address])
    // console.log(BigIntAddress)
    let BigIntAddress = "";
    
    // Not in valid format!
    try {
        BigIntAddress = BigInt(address).toString()
    } catch (e) {
        return {isValidPollId: true, siblings: [], pathIndices: []}
    }
    if (BigIntAddress in merkleTree.leafToPathElements == false) {
        return {isValidPollId: true, siblings: [], pathIndices: []}
    } else {
        
        var BigIntSiblings = merkleTree.leafToPathElements[BigIntAddress]
        console.log(BigIntSiblings)
        for (var i = 0; i < BigIntSiblings.length; i++) {
        siblings.push(BigIntSiblings[i].toString())
        }
        return {isValidPollId: true, siblings: siblings, pathIndices: merkleTree.leafToPathIndices[BigIntAddress]}
    }
}

// /** 
//  * @function: getSiblingsAndPathIndices
//  * @description: This function gets the siblings and path indices of an address in a merkle tree for the verifier & generator.
//  * @returns {number} pollId - Poll id of the poll that was created.
//  * @returns {[]string} tree - The merkle tree that was created.
//  */
// async function getTreeFromPollId(pollId: number) {

//     const tree = await prisma.merkleTree.findUnique({
//         where: {
//             id: pollId
//         },
//     })
//     // Print all polls!
//     // console.dir(tree, { depth: null })

//     return {tree: tree, pollId: pollId}
// }