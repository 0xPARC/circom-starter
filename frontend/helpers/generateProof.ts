import axios from "axios";
import { getSiblingsAndPathIndices } from "./merkle";
// const snarkjs = require("snarkjs");
// TODO: Change the storage of the Merkle Tree to an S3 Bucket

import { downloadFromFilename, fullProve } from '../lib/zkp'

const splitPrivateKey = (bigint_identityNullifier: bigint) => {
    const shift = BigInt(2 ** 64);
    const shift2 = shift * shift;
    const shift3 = shift2 * shift;
  
    const chunk1 = bigint_identityNullifier % shift;
    const chunk2 = ((bigint_identityNullifier - chunk1) / shift) % shift;
    const chunk3 =
      ((bigint_identityNullifier - chunk1 - chunk2 * shift) / shift2) % shift;
    const chunk4 =
      ((bigint_identityNullifier - chunk1 - chunk2 * shift - chunk3 * shift2) /
        shift3) %
      shift;
  
    let chunks = [chunk1, chunk2, chunk3, chunk4];
    return chunks;
  };



async function generateProof(identityNullifier: string, publicKey: string, vote: number, pollId: number) {

    const response = await getSiblingsAndPathIndices(publicKey, pollId);
    

    const siblings = response.siblings
    const pathIndices = response.pathIndices

    const splitIdentityNullifier = splitPrivateKey(BigInt(identityNullifier));

    const input = {
        identityNullifier: identityNullifier,
        splitIdentityNullifier: splitIdentityNullifier,
        treePathIndices: pathIndices,
        treeSiblings: siblings,
        signalHash: vote.toString(),
        externalNullifier: pollId
    }

    await downloadFromFilename("https://d34j71521rx7kc.cloudfront.net", "ecdsa-semaphore_16");

    const {proof, publicSignals} = await fullProve(input, "ecdsa-semaphore_16")
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
    const nullifierHash = publicSignals[1];

    return ["", proofForTx, nullifierHash];

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
export {generateProof}