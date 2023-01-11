import {ethers} from 'ethers';
// TODO: REPLACE WITH VALID ABI
// import testABI from './abi/test.json';

/** 
 * @function: createPoll
 * @description: Creates a poll specified by pollId and the merkleRoot.
 * @param {string} req.body.data.title - The title of the poll.
 * @param {[]string} req.body.data.addresses - The addresses that can vote in the poll.
 * @param {string} req.body.data.description - The description of the poll.
 * @param {string} req.body.data.groupDescription - The description of the group.
 * @param {number} req.body.data.createdAt - The time the poll was created.
 * @param {number} req.body.data.deadline - The deadline of the poll.
 */
export async function createPoll(nullifier: string, vote: number, proof: string, pollId: number) {

    // TODO: REPLACE WITH VERIFIER SMART CONTRACT
    const TEST_CONTRACT_ADDRESS = "0x44E84A10341BF772906c37fFc30CDbb132eA35f2"

    // Initialize wallet from env private variable
    const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL, "goerli");
    const wallet = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, provider);
    
    // console.log(wallet.address)
    // const contract = new ethers.Contract(TEST_CONTRACT_ADDRESS, testABI, wallet);

    // TODO: REPLACE DUMMY CALL HERE WITH ACTUAL CALL TO VERIFIER CONTRACT
    // const tx = await contract.setMessage("Hack Lodge is based!");
    // const receipt = await tx.wait();
    // console.log(receipt);


    // Relay vote to smart contract

    // return {txHash: receipt.transactionHash}
}
