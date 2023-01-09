// import { builder } from './witness_calculator'
// import { groth16 } from 'snarkjs'
const fs = require("fs");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { assert } = require("chai");
const { buildPoseidon } = require("circomlibjs");

describe("testing a simple poll", function () {
  let verifier;
  let accounts;
  let privPoll;
  let coordinator;

  before(async function () {
    accounts = await ethers.getSigners();
    coordinator = accounts[0].address;

    // Deploy the verifier contract
    const SemaphoreVerifier = await ethers.getContractFactory("VerifyPoll");
    verifier = await SemaphoreVerifier.deploy();
    await verifier.deployed();

    // Deploy the voting contract and pass in the verifier contract
    const PrivPoll = await ethers.getContractFactory("PrivPoll");
    privPoll = await PrivPoll.deploy([
      {
        contractAddress: verifier.address,
        merkleTreeDepth: "0",
      },
    ]);
    await privPoll.deployed();
  });

  it("should create a poll", async function () {
    // Create a poll
    const merkleRoot =
      "0x0000000000000000000000000000000000000000000000000000000000000123";
    const merkleTreeDepth = "0";
    const pollId = "1";
    await privPoll.createPoll(pollId, coordinator, merkleRoot, merkleTreeDepth);
  });

  it("should start a poll", async function () {
    // Create a poll
    const merkleRoot =
      "0x0000000000000000000000000000000000000000000000000000000000000123";
    const merkleTreeDepth = "0";
    const pollId = "1";
    await privPoll.createPoll(pollId, coordinator, merkleRoot, merkleTreeDepth);

    // Start the poll
    await privPoll.startPoll(pollId, { from: coordinator });
  });

  it("should cast a vote", async function () {
    // Create a poll
    const merkleRoot =
      "0x0000000000000000000000000000000000000000000000000000000000000123";
    const merkleTreeDepth = "0";
    const pollId = "1";
    await privPoll.createPoll(pollId, coordinator, merkleRoot, merkleTreeDepth);
    // Start the poll
    await privPoll.startPoll(pollId, { from: coordinator });

    let circuit;
    let poseidon;

    const poseidonKey = 0;
    const poseidonNumOutputs = 1;
    const sampleInput = {
      identityNullifier: "123",
      identityTrapdoor: "0",
      treePathIndices: [],
      treeSiblings: [],
      signalHash: "1",
      externalNullifier: "0",
    };
    const sanityCheck = true;

    poseidon = await buildPoseidon();
    circuit = await hre.circuitTest.setup("semaphore");
    const witness = await circuit.calculateLabeledWitness(
      sampleInput,
      sanityCheck
    );
    assert.propertyVal(
      witness,
      "main.identityNullifier",
      sampleInput.identityNullifier
    );
    assert.propertyVal(
      witness,
      "main.identityTrapdoor",
      sampleInput.identityTrapdoor
    );

    assert.propertyVal(witness, "main.signalHash", sampleInput.signalHash);

    assert.propertyVal(
      witness,
      "main.signalHashSquared",
      String(parseInt(sampleInput.signalHash) ** 2)
    );

    const poseidonSecret = poseidon(
      [sampleInput.identityNullifier, sampleInput.identityTrapdoor],
      poseidonKey,
      poseidonNumOutputs
    );
    assert.propertyVal(
      witness,
      "main.secret",
      String(poseidon.F.toObject(poseidonSecret))
    );

    const poseidonIdentityCommitment = poseidon([poseidonSecret]);

    assert.propertyVal(
      witness,
      "main.root",
      String(poseidon.F.toObject(poseidonIdentityCommitment))
    );

    assert.propertyVal(witness, "main.signalHash", sampleInput.signalHash);
    assert.propertyVal(
      witness,
      "main.externalNullifier",
      sampleInput.externalNullifier
    );
    const poseidonNullifierHash = poseidon(
      [sampleInput.externalNullifier, sampleInput.identityNullifier],
      poseidonKey,
      poseidonNumOutputs
    );
    const nullifier = String(poseidon.F.toObject(poseidonNullifierHash));
    assert.propertyVal(witness, "main.nullifierHash", nullifier);

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      sampleInput,
      "/Users/daryakaviani/priv-poll/circuits/semaphore.wasm",
      "/Users/daryakaviani/priv-poll/circuits/semaphore.zkey"
    );

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

    // Read the contents of the JSON file into a string
    const vkeyStr = fs.readFileSync(
      "/Users/daryakaviani/priv-poll/circuits/semaphore.vkey.json",
      "utf8"
    );

    // Parse the JSON string and generate the JSON object
    const vkey = JSON.parse(vkeyStr);

    const proofVerified = await snarkjs.groth16.verify(
      vkey,
      publicSignals,
      proof
    );

    assert(proofVerified, "Proof did not verify.");

    // Cast a vote
    const vote =
      "0x0000000000000000000000000000000000000000000000000000000000000001";

    await privPoll.castVote(vote, nullifier, pollId, proofForTx, {
      from: coordinator,
    });
  });

  // // Fetch the zkey and wasm files, and convert them into array buffers
  // let resp = await fetch("circuits/semaphore.zkey");
  // const wasmBuff = await resp.arrayBuffer("circuits/semaphore.wasm");
  // resp = await fetch(zkeyPath);
  // const zkeyBuff = await resp.arrayBuffer();

  // const circuitInputs = {
  //   identityNullifier: "123",
  //   identityTrapdoor: "0",
  //   treePathIndices: [],
  //   treeSiblings: [],
  //   signalHash: "1",
  //   externalNullifier: "0",
  // };

  // const witnessCalculator = await builder(wasmBuff);
  // const wtnsBuff = await witnessCalculator.calculateWTNSBin(circuitInputs, 0);

  // const start = Date.now();
  // const { proof, publicSignals } = await groth16.prove(
  //   new Uint8Array(zkeyBuff),
  //   wtnsBuff,
  //   null
  // );
  // const end = Date.now();
  // const timeTaken = ((end - start) / 1000).toString() + " seconds";

  // const timeComponent = document.getElementById("time");
  // timeComponent.innerHTML = timeTaken;

  // const proofAsStr = JSON.stringify(
  //   proofForTx.map((x) => BigInt(x).toString(10))
  // )
  //   .split("\n")
  //   .join()
  //   .replaceAll('"', "");
  //   });

  //   it("should not cast a vote if nullifier hash has already been used", async function () {
  //     // Create a poll
  //     const merkleRoot =
  //       "0x0000000000000000000000000000000000000000000000000000000000000123";
  //     const merkleTreeDepth = "0";
  //     const pollId = "1";
  //     await privPoll.createPoll(pollId, coordinator, merkleRoot, merkleTreeDepth);
  //     // Start the poll
  //     await privPoll.startPoll(pollId, { from: coordinator });

  //     // Cast a vote
  //     const vote =
  //       "0x0000000000000000000000000000000000000000000000000000000000000001";
  //     const nullifierHash =
  //       "0x0000000000000000000000000000000000000000000000000000000000000123";
  //     const proof = [
  //       "0x0000000000000000000000000000000000000000000000000000000000000123",
  //       "0x0000000000000000000000000000000000000000000000000000000000004567",
  //       "0x00000000000000000000000000000000000000000000000000000000000089ab",
  //       "0x000000000000000000000000000000000000000000000000000000000000cdef",
  //       "0x000000000000000000000000000000000000000000000000000000000000fedc",
  //       "0x000000000000000000000000000000000000000000000000000000000000ba98",
  //       "0x0000000000000000000000000000000000000000000000000000000000007654",
  //       "0x0000000000000000000000000000000000000000000000000000000000003210",
  //     ];

  //     await privPoll.castVote(vote, nullifierHash, pollId, proof, {
  //       from: coordinator,
  //     });

  //     // Try to cast another vote with the same nullifier hash
  //     await expect(
  //       privPoll.castVote(vote, nullifierHash, pollId, proof, {
  //         from: coordinator,
  //       })
  //     ).to.be.revertedWith("You are using the same nullifier twice");
  //   });
});

// const calculateProof = async (address, secret) => {

//   const proofCompnent = document.getElementById("proof");
//   proofCompnent.innerHTML = proofAsStr;

//   const nullifier = document.getElementById("nullifier");
//   nullifier.innerHTML = BigInt(publicSignals[0]).toString();

//   // Verify the proof
//   resp = await fetch(vkPath);
//   const vkey = await resp.json();

//   const res = await groth16.verify(vkey, publicSignals, proof);

//   const resultComponent = document.getElementById("result");
//   resultComponent.innerHTML = res;
// };
