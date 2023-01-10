import { ethers } from "hardhat";

async function main() {
    let verifier;
    let privPoll;
    const SemaphoreVerifier = await ethers.getContractFactory("VerifyPoll");
    verifier = await SemaphoreVerifier.deploy();
    await verifier.deployed();

    const PrivPoll = await ethers.getContractFactory("PrivPoll");
    
    privPoll = await PrivPoll.deploy([
        {
          contractAddress: verifier.address,
          merkleTreeDepth: "15",
        },
      ]);
    await privPoll.deployed();
    console.log('Verifier deployed to:', verifier.address);
    console.log('Poll deployed to:', privPoll.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});