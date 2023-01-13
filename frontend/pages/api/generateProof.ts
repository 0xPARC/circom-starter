// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {relayVote} from './helpers/relayVote'
const snarkjs = require("snarkjs");
import path from 'path'
import {promises as fs} from 'fs'
// import vkey from "./semaphore.vkey.json";
// import wasmKey from "./semaphore.wasm";
// import zKey from "./semaphore.zkey";
import prisma from '../../lib/prisma'
import { Prisma } from '@prisma/client'
import { none } from 'ramda';

/** 
 * @description: This is the API endpoint for submitting a vote via the relay.
 */

type Data = {
    name: string
    proofForTx: string[]
    nullifierHash: string
}

type Proof = {
    pi_a: string[]
    pi_b: string[]
    pi_c: string[]
    protocol: string
    curve: string
}

/** 
 * @function: handler
 * @description: This is the handler for the API endpoint.
 * @param {string} req.body.data.identityNullifier - The identity nullifier (private key) for proof.
 * @param {number} req.body.data.treePathIndicies - The tree path indices for proof.
 * @param {string} req.body.data.treeSiblings - The tree siblings for proof.
 * @param {string} req.body.data.externalNullifier - The external nullifier (poll id) for proof.
 * @param {number} req.body.data.signalHash - The signal hash (vote) for proof.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        res.status(405).json({
        name: "POST endpoint", proofForTx: [], nullifierHash: ""
        })
    }
    if (typeof req.body == 'string') {
        var body = JSON.parse(req.body)
    } else {
        var body = req.body
    }
    if ("data" in body == false) {
        res.status(400).json({
            name: "No Data", proofForTx: [], nullifierHash: ""
        })
    }
    var data = body.data

    var identityNullifier, treePathIndices, treeSiblings, externalNullifier, signalHash

    // Required fields!
    if ("identityNullifier" in data == false) {
        res.status(400).json({
            name: "Must pass in nullifier", proofForTx: [], nullifierHash: ""
        })
    } else {
        identityNullifier = data.identityNullifier
    }
    if ("treePathIndices" in data == false) {
        res.status(400).json({
            name: "Must pass in tree path indices", proofForTx: [], nullifierHash: ""
        })
    } else {
        treePathIndices = data.treePathIndices
    }
    if ("treeSiblings" in data == false) {
        res.status(400).json({
            name: "Must pass in vote", proofForTx: [], nullifierHash: ""
        })
    } else {
        treeSiblings = data.treeSiblings
    }
    if ("externalNullifier" in data == false) {
        res.status(400).json({
            name: "Must pass in a poll id", proofForTx: [], nullifierHash: ""
        })
    } else {
        externalNullifier = data.externalNullifier
    }
    if ("signalHash" in data == false) {
        res.status(400).json({
            name: "Must pass in a signal hash", proofForTx: [], nullifierHash: ""
        })
    } else {
        signalHash = data.signalHash
    }

    const input = {
        identityNullifier: identityNullifier,
        identityTrapdoor: "0",
        treePathIndices: treePathIndices,
        treeSiblings: treeSiblings,
        signalHash: signalHash,
        externalNullifier: externalNullifier
    }

    // const path = __dirname
    console.log(__dirname)
    // const wasmPath = "./semaphore.wasm";
    // const zkeyPath = "./semaphore.zkey";
    // const vkeyPath = "./semaphore.vkey.json";

    const proofKeysDirectory = path.join(process.cwd(), 'proofKeys')

    console.log(input)

    const wasm = await fs.readFile(proofKeysDirectory + '/semaphore.wasm')
    const zKey = await fs.readFile(proofKeysDirectory + '/semaphore.zkey')
    const vKey = await fs.readFile(proofKeysDirectory + '/semaphore.vkey.json')

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasm, zKey);
    console.log("public signals: ", publicSignals)
    console.log(proof)
    if ("pi_a" in proof == false) {
        res.status(400).json({
            name: "Proof not generated", proofForTx: [], nullifierHash: ""
        })
    }
    const proofForTx = [
        proof.pi_a[0],
        proof.pi_a[1],
        proof.pi_b[0][1],
        proof.pi_b[0][0],
        proof.pi_b[1][1],
        proof.pi_b[1][0],
        proof.pi_c[0],
        proof.pi_c[1],
      ];

    return res.status(200).json({ name: "Voted!", proofForTx: proofForTx, nullifierHash: publicSignals[1]})

}
//   if (outputData.isValidPollId == false) {
//     return res.status(400).json({ name: "invalid poll id", inTree: false, pollId: pollId })
//   } else {
//     if (outputData.inTree == true) {
//       return res.status(200).json({ name: "address in tree", inTree: true, pollId: pollId })
//     } else {
//       return res.status(200).json({ name: "address not in tree", inTree: false, pollId: pollId })
//     }
//   }
