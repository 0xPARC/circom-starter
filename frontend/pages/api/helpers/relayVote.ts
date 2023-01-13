import {utils, ethers} from 'ethers';
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
    try {
        const tx = await contract.castVote(strVote, nullifier, pollId.toString(), proof,
            {
            from: relayer,
            gasLimit: '3000000'
            })
        const receipt = await tx.wait();
        return {txHash: receipt.transactionHash, success: true}

    } catch(error: any) {
        if (error.code === utils.Logger.errors.CALL_EXCEPTION) {
    
            // The receipt
            console.log(error.receipt);
    
        } else if (error.code === utils.Logger.errors.TRANSACTION_REPLACED) {
    
            // The receipt of the replacement transaction
            console.log(error.receipt);
    
            // The reason ("repriced", "cancelled" or "replaced")
            console.log(error.reason);
    
            // The transaction that replaced this one
            console.log(error.replacement);
    
        } else {
            // This shouldn't really happen; maybe server error, like the internet connection failed?
        }
        return {txHash: error.transactionHash, success: false}
    }


    // Relay vote to smart contract
}
