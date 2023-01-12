import {ethers} from 'ethers';
// TODO: REPLACE WITH VALID ABI
import testABI from './abi/test.json';
import privPollABI from './abi/privpoll1.json'

export async function relayVote(nullifier: string, vote: number, proof: string, pollId: number) {

    // TODO: REPLACE WITH PRIV_POLL SMART CONTRACT
    const PRIV_POLL_CONTRACT_ADDRESS = "0xEd5Eae6415C5502EE94768c653766CdEc48aFe16"

    // Initialize wallet from env private variable
    const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL, "goerli");
    const wallet = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, provider);
    
    // console.log(wallet.address)
    const contract = new ethers.Contract(PRIV_POLL_CONTRACT_ADDRESS, privPollABI, wallet);

    // TODO: REPLACE DUMMY CALL HERE WITH ACTUAL CALL TO VERIFIER CONTRACT
    console.log("Right before cast vote")
    console.log("vote", typeof(vote))
    console.log("nullifier", typeof(nullifier))
    console.log("pollId", typeof(pollId))
    console.log("proof", typeof(proof))
    var strVote;
    if (vote == 0) {
        strVote =
        "0x0000000000000000000000000000000000000000000000000000000000000000";
    } else {
        strVote =
        "0x0000000000000000000000000000000000000000000000000000000000000001";
    }
    // const tx = await contract.getPollState(pollId)

    const tx = await contract.castVote(strVote, nullifier, pollId, proof)
    const receipt = tx.wait();
    console.log(receipt);


    // Relay vote to smart contract

    return {txHash: receipt.transactionHash}
}
