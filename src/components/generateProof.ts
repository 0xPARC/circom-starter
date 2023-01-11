import { ethers } from "ethers";
import axios from "axios";
const hre = require("hardhat");
const circomlib = require("circomlibjs");

// TODO: Change the storage of the Merkle Tree to an S3 Bucket
async function generateProof(identityNullifier: string, address: string, vote: number, pollId: number) {
    const response = await axios.post("/api/getSiblings", {
        data: {
            address: address,
            pollId: pollId
        }
    })

    const siblings = response.data.siblings;
    const pathIndices = response.data.pathIndices;

    const input = {
        identityNullifier: identityNullifier,
        identityTrapdoor: "0",
        treePathIndices: pathIndices,
        treeSiblings: siblings,
        signalHash: vote.toString(),
        externalNullifier: pollId
    }

    const wasmPath = "./semaphore.wasm";
    const zkeyPath = "./semaphore.zkey";
    const vkeyPath = "./semaphore.vkey.json";

    const worker = new Worker("./worker.js");
    worker.postMessage([input]);
    worker.onmessage = (e) => {
        const { proof, publicSignals } = e.data;
        console.log("PROOF SUCCESSFULLY GENERATED: ", proof);
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
          return proofForTx;
    }
    // // deploy sema contract
    // const PrivPoll = await hre.ethers.getContractFactory("PrivPoll");
    // // Verifier 16
    // const verifierAddress = "0xA5253ba39381Aa99c4C2C5A4D5C2deC036d06629";
    // const privPoll = await PrivPoll.deploy([
    //   {
    //     merkleTreeDepth: 16,
    //     contractAddress: verifierAddress,
    //   },
    // ]);
    // await privPoll.deployed();
   
    // console.log(`Poll contract has been deployed to: ${privPoll.address}`);
}
    
    // let verifier;
    // let privPoll;
    // const SemaphoreVerifier = await ethers.getContractFactory("VerifyPoll");
    // verifier = await SemaphoreVerifier.deploy();
    // await verifier.deployed();

    // const PrivPoll = await ethers.getContractFactory("PrivPoll");
    
    // privPoll = await PrivPoll.deploy([
    //     {
    //       contractAddress: verifier.address,
    //       merkleTreeDepth: "16",
    //     },
    //   ]);
    // await privPoll.deployed();
    // console.log('Verifier deployed to:', verifier.address);
    // console.log('Poll deployed to:', privPoll.address);


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
export {generateProof}