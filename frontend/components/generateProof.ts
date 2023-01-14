import axios from "axios";
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
    console.log("Generating Proof")
    console.log("Address: ", publicKey)
    const response = await axios.post("/api/getSiblings", {
        data: {
            address: publicKey,
            pollId: pollId
        }
    })

    if (response.data.name == "invalid poll id") {
            return ["There is no poll corresponding to this poll ID.", [], ""]
    } else if (response.data.name == "invalid address for poll") {
        return ["This address is not eligible for this poll.", [], ""]
    }
    

    const siblings = response.data.siblings;
    const pathIndices = response.data.pathIndices;

    const splitIdentityNullifier = splitPrivateKey(BigInt(identityNullifier));

    const input = {
        identityNullifier: identityNullifier,
        splitIdentityNullifier: splitIdentityNullifier,
        treePathIndices: pathIndices,
        treeSiblings: siblings,
        signalHash: vote.toString(),
        externalNullifier: pollId
    }

    // const wasmPath = "./semaphore.wasm";
    // const zkeyPath = "./semaphore.zkey";
    // const vkeyPath = "./semaphore.vkey.json";

    await downloadFromFilename("https://zkpoll.s3.us-west-1.amazonaws.com/", "ecdsa-semaphore_16");

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

    // const outputResponse = await axios.post("/api/generateProof", {
    //     data: input
    // })

    // const proofForTx = outputResponse.data.proofForTx;
    // const nullifierHash = publicSignals[1];
    // console.log("In components", outputResponse.data.name)
    return ["", proofForTx, nullifierHash];


    // const result = await snarkjs.groth16.fullProve(
    //     input,
    //     "./semaphore.wasm",
    //     "./semaphore.zkey"
    //   );

    // const worker = new Worker("worker.js");
    // // console.log("Before posting input to worker")
    // worker.postMessage([input]);
    // // console.log("After posting input to worker")
    // worker.onmessage = (e) => {
    //     console.log("In onmessage")
    //     const { proof, publicSignals } = e.data;
    //     console.log("PROOF SUCCESSFULLY GENERATED: ", proof);
    //     const proofForTx = [
    //         proof.pi_a[0],
    //         proof.pi_a[1],
    //         proof.pi_b[0][1],
    //         proof.pi_b[0][0],
    //         proof.pi_b[1][1],
    //         proof.pi_b[1][0],
    //         proof.pi_c[0],
    //         proof.pi_c[1],
    //       ];
    //       return proofForTx;
    // }

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
export {generateProof}