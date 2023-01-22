import { ethers } from "hardhat";
const hre = require("hardhat");
const circomlib = require("circomlibjs");

async function main() {
  let verifier;
  let privPoll;
  const SemaphoreVerifier = await ethers.getContractFactory(
    "ECDSASemaphoreVerifier"
  );
  verifier = await SemaphoreVerifier.deploy();
  await verifier.deployed();

  console.log(`Verifier contract has been deployed to: ${verifier.address}`);

  const PrivPoll = await hre.ethers.getContractFactory("PrivPoll");
  privPoll = await PrivPoll.deploy([
    {
      merkleTreeDepth: 16,
      contractAddress: verifier.address,
    },
  ]);
  await privPoll.deployed();

  console.log(`Poll contract has been deployed to: ${privPoll.address}`);
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
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
