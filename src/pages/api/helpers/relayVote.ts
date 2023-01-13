import {ethers} from 'ethers';
// TODO: REPLACE WITH VALID ABI
import testABI from './abi/test.json';
import privPollABI from './abi/privpoll1.json'

export async function relayVote(nullifier: string, vote: number, proof: string, pollId: number) {

    // TODO: REPLACE WITH PRIV_POLL SMART CONTRACT
    const PRIV_POLL_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GOERLI_POLL_CONTRACT

    // Initialize wallet from env private variable
    // Replace with local host endpoint & private key
    const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL, "goerli");
    const wallet = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, provider);
    
    // console.log(wallet.address)
    const contract = new ethers.Contract(PRIV_POLL_CONTRACT_ADDRESS, privPollABI, wallet);


    // TODO: REPLACE DUMMY CALL HERE WITH ACTUAL CALL TO VERIFIER CONTRACT
    console.log("Right before cast vote")
    console.log("vote", typeof(vote), vote)
    console.log("nullifier", typeof(nullifier), nullifier)
    console.log("pollId", typeof(pollId), pollId)
    console.log("proof", typeof(proof), proof)
    var strVote;
    if (vote == 0) {
        strVote =
        "0x0000000000000000000000000000000000000000000000000000000000000000";
    } else {
        strVote =
        "0x0000000000000000000000000000000000000000000000000000000000000001";
    }
    // const tx = await contract.getPollState(pollId)
    const relayer = "0x426bF8b7C4f5CB67eb838CE2585116598cE3019A"
    console.log("Relayer", relayer);
    const tx = await contract.castVote(strVote, nullifier, pollId.toString(), proof,
        {
          from: relayer,
          gasLimit: '2000000'
        })
    const receipt = await tx.wait();
    console.log(receipt);

    // Relay vote to smart contract
    return {txHash: receipt.transactionHash}
}
