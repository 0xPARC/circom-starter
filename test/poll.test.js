// import { builder } from './witness_calculator'
// const { groth16 } = require('snarkjs')
const fs = require("fs");
const { ethers, snarkjs } = require("hardhat");
const hre = require("hardhat");
const { assert } = require("chai");
const { buildPoseidon } = require("circomlibjs");
const path = require("path");


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

  it("cast a vote (null tree)", async function () {
    // Create a poll
    const merkleRoot =
      "0x0000000000000000000000000000000000000000000000000000000000000123";
    const merkleTreeDepth = "0";
    const pollId = "1";
    // console.log("Check 1: ", pollId)
    await privPoll.createPoll(pollId, coordinator, merkleRoot, merkleTreeDepth);
    // Start the poll
    await privPoll.startPoll(pollId, { from: coordinator });

    // console.log("Check 2: ")
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

    // console.log("Check 3: ")
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

    // console.log("Check 4: ")

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

    // console.log("Check 5: ")

    const poseidonNullifierHash = poseidon(
      [sampleInput.externalNullifier, sampleInput.identityNullifier],
      poseidonKey,
      poseidonNumOutputs
    );
    const nullifier = String(poseidon.F.toObject(poseidonNullifierHash));
    assert.propertyVal(witness, "main.nullifierHash", nullifier);
    
    // console.log("Check 6: ")

    const path = __dirname
    const wasmPath = path + "/../circuits/semaphore.wasm";
    // console.log(wasmPath1)
    // const wasmPath = "/Users/ratankaliani/hacklodge/priv-poll/circuits/semaphore.wasm";
    // console.log(wasmPath)
    const zkeyPath = path + "/../circuits/semaphore.zkey";
    // const zkeyPath = "/Users/ratankaliani/hacklodge/priv-poll/circuits/semaphore.zkey";

    // console.log("Check 7: ", wasmPath, zkeyPath)
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      sampleInput,
      wasmPath,
      zkeyPath
    );
    // console.log("Check 8: ", proof, publicSignals)
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

    // console.log("Check 9: ")

    // Read the contents of the JSON file into a string
    const vkeyPath = path + "/../circuits/semaphore.vkey.json";
    // const vkeyPath = "/Users/ratankaliani/hacklodge/priv-poll/circuits/semaphore.vkey.json";
    const vkeyStr = fs.readFileSync(
      vkeyPath,
      "utf8"
    );

    // Parse the JSON string and generate the JSON object
    const vkey = JSON.parse(vkeyStr);

    const proofVerified = await snarkjs.groth16.verify(
      vkey,
      publicSignals,
      proof
    );

    // console.log("Check 4: ", proofVerified)

    assert(proofVerified, "Proof did not verify.");

    // Cast a vote
    const vote =
      "0x0000000000000000000000000000000000000000000000000000000000000001";

    await privPoll.castVote(vote, nullifier, pollId, proofForTx, {
      from: coordinator,
    });

    await privPoll.endPoll(pollId);
    // console.log("Check 9: ")
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

describe("user 101", function () {
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
        merkleTreeDepth: "15",
      },
    ]);
    await privPoll.deployed();
  });

  it("user 101 (pass)", async function () {
    // Create a poll
    const merkleRoot =
      "18594020524654290899512777579579130926554658496346496506121992402799622149061";
    const merkleTreeDepth = "15";
    const pollId = "1";
    // console.log("Check 1: ", pollId)
    await privPoll.createPoll(pollId, coordinator, merkleRoot, merkleTreeDepth);
    // Start the poll
    await privPoll.startPoll(pollId, { from: coordinator });

    // console.log("Check 2: ")
    let circuit;
    let poseidon;

    const poseidonKey = 0;
    const poseidonNumOutputs = 1;
    const sampleInput = {
      identityNullifier: "101",
      identityTrapdoor: "0",
      treePathIndices: [
        "0",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1"
      ],
      treeSiblings: [
        "2288432836880142223029851275820672558598437651915204189407185299212339378544",
        "14435153996940545406483052156559663770915414836007279032119378681709841197735",
        "18624361856574916496058203820366795950790078780687078257641649903530959943449",
        "19831903348221211061287449275113949495274937755341117892716020320428427983768",
        "5101361658164783800162950277964947086522384365207151283079909745362546177817",
        "11552819453851113656956689238827707323483753486799384854128595967739676085386",
        "10483540708739576660440356112223782712680507694971046950485797346645134034053",
        "7389929564247907165221817742923803467566552273918071630442219344496852141897",
        "6373467404037422198696850591961270197948259393735756505350173302460761391561",
        "14340012938942512497418634250250812329499499250184704496617019030530171289909",
        "10566235887680695760439252521824446945750533956882759130656396012316506290852",
        "14058207238811178801861080665931986752520779251556785412233046706263822020051",
        "1841804857146338876502603211473795482567574429038948082406470282797710112230",
        "6068974671277751946941356330314625335924522973707504316217201913831393258319",
        "10344803844228993379415834281058662700959138333457605334309913075063427817480"
      ],
      signalHash: "1",
      externalNullifier: pollId,
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

    // console.log("Check 3: ")
    const poseidonSecret = poseidon(
      [sampleInput.identityNullifier, sampleInput.identityTrapdoor],
      poseidonKey,
      poseidonNumOutputs
    );
    // console.log("Gets to here")
    assert.propertyVal(
      witness,
      "main.secret",
      String(poseidon.F.toObject(poseidonSecret))
    );

    // console.log("Check 4: ")

    const poseidonIdentityCommitment = poseidon([poseidonSecret]);

    assert.propertyVal(
      witness,
      "main.root",
      merkleRoot
    );
    // console.log("Not passing identity commitment")
    
    assert.propertyVal(witness, "main.signalHash", sampleInput.signalHash);
    assert.propertyVal(
      witness,
      "main.externalNullifier",
      sampleInput.externalNullifier
    );

    // console.log("Check 5: ")

    const poseidonNullifierHash = poseidon(
      [sampleInput.externalNullifier, sampleInput.identityNullifier],
      poseidonKey,
      poseidonNumOutputs
    );
    const nullifier = String(poseidon.F.toObject(poseidonNullifierHash));
    assert.propertyVal(witness, "main.nullifierHash", nullifier);
    
    // console.log("Check 6: ")

    const path = __dirname
    const wasmPath = path + "/../circuits/semaphore.wasm";
    // console.log(wasmPath1)
    // const wasmPath = "/Users/ratankaliani/hacklodge/priv-poll/circuits/semaphore.wasm";
    // console.log(wasmPath)
    const zkeyPath = path + "/../circuits/semaphore.zkey";
    // const zkeyPath = "/Users/ratankaliani/hacklodge/priv-poll/circuits/semaphore.zkey";

    // console.log("Check 7: ", wasmPath, zkeyPath)
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      sampleInput,
      wasmPath,
      zkeyPath
    );
    // console.log("Check 8: ", proof, publicSignals)
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

    // console.log("Check 9: ")

    // Read the contents of the JSON file into a string
    const vkeyPath = path + "/../circuits/semaphore.vkey.json";
    // const vkeyPath = "/Users/ratankaliani/hacklodge/priv-poll/circuits/semaphore.vkey.json";
    const vkeyStr = fs.readFileSync(
      vkeyPath,
      "utf8"
    );

    // Parse the JSON string and generate the JSON object
    const vkey = JSON.parse(vkeyStr);

    const proofVerified = await snarkjs.groth16.verify(
      vkey,
      publicSignals,
      proof
    );

    console.log("Check 4: ", proofVerified)

    assert(proofVerified, "Proof did not verify.");

    // Cast a vote
    const vote =
      "0x0000000000000000000000000000000000000000000000000000000000000001";

    const receipt = await privPoll.castVote(vote, nullifier, pollId, proofForTx, {
      from: coordinator,
    });

    // console.log(receipt)

    await privPoll.endPoll(pollId);
    // console.log("Check 9: ")
  });
});
describe("user 401", function () {
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
        merkleTreeDepth: "15",
      },
    ]);
    await privPoll.deployed();
  });
  it("user 401 (pass)", async function () {
    // Create a poll
    const merkleRoot =
      "18594020524654290899512777579579130926554658496346496506121992402799622149061";
    const merkleTreeDepth = "15";
    const pollId = "1";
    // console.log("Check 1: ", pollId)
    await privPoll.createPoll(pollId, coordinator, merkleRoot, merkleTreeDepth);
    // Start the poll
    await privPoll.startPoll(pollId, { from: coordinator });

    // console.log("Check 2: ")
    let circuit;
    let poseidon;

    const poseidonKey = 0;
    const poseidonNumOutputs = 1;
    const sampleInput = {
      identityNullifier: "401",
      identityTrapdoor: "0",
      treePathIndices: [
        "0",
        "0",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1"
      ],
      treeSiblings: [
        "15031200245754860529307938414931900106970756465442563534673447347431600286950",
        "19068111245356538414096790025714731750319382447257436973804441538287758972157",
        "18624361856574916496058203820366795950790078780687078257641649903530959943449",
        "19831903348221211061287449275113949495274937755341117892716020320428427983768",
        "5101361658164783800162950277964947086522384365207151283079909745362546177817",
        "11552819453851113656956689238827707323483753486799384854128595967739676085386",
        "10483540708739576660440356112223782712680507694971046950485797346645134034053",
        "7389929564247907165221817742923803467566552273918071630442219344496852141897",
        "6373467404037422198696850591961270197948259393735756505350173302460761391561",
        "14340012938942512497418634250250812329499499250184704496617019030530171289909",
        "10566235887680695760439252521824446945750533956882759130656396012316506290852",
        "14058207238811178801861080665931986752520779251556785412233046706263822020051",
        "1841804857146338876502603211473795482567574429038948082406470282797710112230",
        "6068974671277751946941356330314625335924522973707504316217201913831393258319",
        "10344803844228993379415834281058662700959138333457605334309913075063427817480"
      ],
      signalHash: "1",
      externalNullifier: pollId,
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

    // console.log("Check 3: ")
    const poseidonSecret = poseidon(
      [sampleInput.identityNullifier, sampleInput.identityTrapdoor],
      poseidonKey,
      poseidonNumOutputs
    );
    // console.log("Gets to here")
    assert.propertyVal(
      witness,
      "main.secret",
      String(poseidon.F.toObject(poseidonSecret))
    );

    // console.log("Check 4: ")

    // const poseidonIdentityCommitment = poseidon([poseidonSecret]);

    assert.propertyVal(
      witness,
      "main.root",
      merkleRoot
    );
    // console.log("Not passing identity commitment")
    
    assert.propertyVal(witness, "main.signalHash", sampleInput.signalHash);
    assert.propertyVal(
      witness,
      "main.externalNullifier",
      sampleInput.externalNullifier
    );

    // console.log("Check 5: ")

    const poseidonNullifierHash = poseidon(
      [sampleInput.externalNullifier, sampleInput.identityNullifier],
      poseidonKey,
      poseidonNumOutputs
    );
    const nullifier = String(poseidon.F.toObject(poseidonNullifierHash));
    assert.propertyVal(witness, "main.nullifierHash", nullifier);
    
    // console.log("Check 6: ")

    const path = __dirname
    const wasmPath = path + "/../circuits/semaphore.wasm";
    // console.log(wasmPath1)
    // const wasmPath = "/Users/ratankaliani/hacklodge/priv-poll/circuits/semaphore.wasm";
    // console.log(wasmPath)
    const zkeyPath = path + "/../circuits/semaphore.zkey";
    // const zkeyPath = "/Users/ratankaliani/hacklodge/priv-poll/circuits/semaphore.zkey";

    // console.log("Check 7: ", wasmPath, zkeyPath)
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      sampleInput,
      wasmPath,
      zkeyPath
    );
    // console.log("Check 8: ", proof, publicSignals)
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

    // console.log("Check 9: ")

    // Read the contents of the JSON file into a string
    const vkeyPath = path + "/../circuits/semaphore.vkey.json";
    // const vkeyPath = "/Users/ratankaliani/hacklodge/priv-poll/circuits/semaphore.vkey.json";
    const vkeyStr = fs.readFileSync(
      vkeyPath,
      "utf8"
    );

    // Parse the JSON string and generate the JSON object
    const vkey = JSON.parse(vkeyStr);

    const proofVerified = await snarkjs.groth16.verify(
      vkey,
      publicSignals,
      proof
    );

    // console.log("Check 4: ", proofVerified)

    assert(proofVerified, "Proof did not verify.");

    // Cast a vote
    const vote =
      "0x0000000000000000000000000000000000000000000000000000000000000001";

    const receipt = await privPoll.castVote(vote, nullifier, pollId, proofForTx, {
      from: coordinator,
    });

    // console.log(receipt)

    await privPoll.endPoll(pollId);
    // console.log("Check 9: ")
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
});