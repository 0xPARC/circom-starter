import axios from "axios";
// const snarkjs = require("snarkjs");
// TODO: Change the storage of the Merkle Tree to an S3 Bucket
async function castVote(nullifierHash: string, proof: string[], vote: number, pollId: number) {
    console.log("Casting vote")
    const response = await axios.post("/api/submitVote", {
        data: {
            nullifierHash: nullifierHash,
            vote: vote,
            proof: proof,
            pollId: pollId
        }
    })
    // console.log("In components", outputResponse.data.name)
    return [response.data.name, response.data.txHash, response.data.pollId];

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
export {castVote}