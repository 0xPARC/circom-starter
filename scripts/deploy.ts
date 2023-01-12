import { ethers } from "hardhat";
const hre = require("hardhat");
const circomlib = require("circomlibjs");

async function main() {
    // const poseidonT3ABI = circomlib.poseidonContract.generateABI(2);
    // const poseidonT3Bytecode = circomlib.poseidonContract.createCode(2);
   
    // const [signer] = await hre.ethers.getSigners();
   
    // const PoseidonLibT3Factory = new hre.ethers.ContractFactory(
    //   poseidonT3ABI,
    //   poseidonT3Bytecode,
    //   signer
    // );
    // const poseidonT3Lib = await PoseidonLibT3Factory.deploy();
   
    // await poseidonT3Lib.deployed();
   
    // console.log(
    //   `PoseidonT3 library has been deployed to: ${poseidonT3Lib.address}`
    // );
   
    // const IncrementalBinaryTreeLibFactory = await hre.ethers.getContractFactory(
    //   "IncrementalBinaryTree",
    //   {
    //     libraries: {
    //       PoseidonT3: poseidonT3Lib.address,
    //     },
    //   }
    // );
    // const incrementalBinaryTreeLib =
    //   await IncrementalBinaryTreeLibFactory.deploy();
   
    // await incrementalBinaryTreeLib.deployed();
   
    // console.log(
    //   `IncrementalBinaryTree library has been deployed to: ${incrementalBinaryTreeLib.address}`
    // );
    // // deploy sema contract
    // const PrivPoll = await hre.ethers.getContractFactory("PrivPoll", {
    // libraries: {
    //     IncrementalBinaryTree: incrementalBinaryTreeLib.address,
    // },
    // });
    // deploy sema contract
    const PrivPoll = await hre.ethers.getContractFactory("PrivPoll");
    // Verifier 16
    const verifierAddress = "0xA5253ba39381Aa99c4C2C5A4D5C2deC036d06629";
    const privPoll = await PrivPoll.deploy([
      {
        merkleTreeDepth: 16,
        contractAddress: verifierAddress,
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