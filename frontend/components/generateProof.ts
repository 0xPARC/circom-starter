import axios from "axios";
// const snarkjs = require("snarkjs");
// TODO: Change the storage of the Merkle Tree to an S3 Bucket
async function generateProof(identityNullifier: string, publicKey: string, vote: number, pollId: number) {
    console.log("Generating Proof")
    console.log("Address: ", publicKey)
    const response = await axios.post("/api/getSiblings", {
        data: {
            address: publicKey,
            pollId: pollId
        }
    })

    const siblings = response.data.siblings;
    const pathIndices = response.data.pathIndices;

    const input = {
        identityNullifier: identityNullifier,
        treePathIndices: pathIndices,
        treeSiblings: siblings,
        signalHash: vote.toString(),
        externalNullifier: pollId
    }

    // const wasmPath = "./semaphore.wasm";
    // const zkeyPath = "./semaphore.zkey";
    // const vkeyPath = "./semaphore.vkey.json";

    const outputResponse = await axios.post("/api/generateProof", {
        data: input
    })

    const proofForTx = outputResponse.data.proofForTx;
    const nullifierHash = outputResponse.data.nullifierHash;
    // console.log("In components", outputResponse.data.name)
    return [proofForTx, nullifierHash];


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