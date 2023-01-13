// import { builder } from './witness_calculator'
// import { groth16 } from 'snarkjs'
const fs = require("fs");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { assert } = require("chai");
const { buildPoseidon } = require("circomlibjs");

describe.only("testing a simple poll", function () {
  let verifier;
  let accounts;
  let privPoll;
  let coordinator;

  before(async function () {
    accounts = await ethers.getSigners();
    coordinator = accounts[0].address;

    // Deploy the verifier contract
    const SemaphoreVerifier = await ethers.getContractFactory(
      "ECDSASemaphoreVerifier16"
    );
    console.log("got ecdsa verifier contract");
    verifier = await SemaphoreVerifier.deploy();
    await verifier.deployed();
    console.log("verifier deployed");

    // Deploy the voting contract and pass in the verifier contract
    const PrivPoll = await ethers.getContractFactory("PrivPoll");
    console.log("got contract PrivPoll");
    privPoll = await PrivPoll.deploy([
      {
        contractAddress: verifier.address,
        merkleTreeDepth: "16",
      },
    ]);
    await privPoll.deployed();
    console.log("privPoll deployed");
  });

  it("should create a poll", async function () {
    // Create a poll
    const merkleRoot =
      "18336434020280204688574480229350786401679346558913537968467856337459799406395";
    const merkleTreeDepth = "16";
    const pollId = "1";
    await privPoll.createPoll(pollId, coordinator, merkleRoot, merkleTreeDepth);
  });

  it("should cast a vote", async function () {
    // Create a poll
    const merkleRoot =
      "18336434020280204688574480229350786401679346558913537968467856337459799406395";
    const merkleTreeDepth = "16";
    const pollId = "1";
    await privPoll.createPoll(pollId, coordinator, merkleRoot, merkleTreeDepth);
    console.log("poll created");
    // Start the poll
    // await privPoll.startPoll(pollId, { from: coordinator });
    // console.log("poll started");

    let circuit;
    let poseidon;

    const poseidonKey = 0;
    const poseidonNumOutputs = 1;
    const sampleInput = {
      identityNullifier:
        "29980590644713171901284555306875329217885936229213536076981879180646816393547",
      treePathIndices: [
        "0",
        "1",
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
      ],
      treeSiblings: [
        "721217597761491358077856116362363787603688993368",
        "20553600951042130467022246090001516947989984500035100828661445470569916925403",
        "14376321156333623292442833001262029886166557808034230636694718418309264470582",
        "8988132251678213623745359597150773786086744623371262342331165355577271880267",
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
        "10344803844228993379415834281058662700959138333457605334309913075063427817480",
        "19613055433354010593181510296481106659265254887405599851386217491513440263534",
      ],
      signalHash: "1",
      externalNullifier: "1",
    };
    const sanityCheck = true;

    poseidon = await buildPoseidon();
    console.log("poseidon built");
    circuit = await hre.circuitTest.setup("ecdsa-semaphore");
    console.log("circuit built");
    const witness = await circuit.calculateLabeledWitness(
      sampleInput,
      sanityCheck
    );

    assert.propertyVal(
      witness,
      "main.identityNullifier",
      sampleInput.identityNullifier
    );
    assert.propertyVal(witness, "main.signalHash", sampleInput.signalHash);
    assert.propertyVal(
      witness,
      "main.externalNullifier",
      sampleInput.externalNullifier
    );

    console.log("inputs passed into circuit correctly");

    assert.propertyVal(
      witness,
      "main.signalHashSquared",
      String(parseInt(sampleInput.signalHash) ** 2)
    );

    assert.propertyVal(
      witness,
      "main.root",
      "18336434020280204688574480229350786401679346558913537968467856337459799406395"
    );

    console.log("calculated root correctly");

    const poseidonNullifierHash = poseidon(
      [sampleInput.externalNullifier, sampleInput.identityNullifier],
      poseidonKey,
      poseidonNumOutputs
    );
    const nullifier = String(poseidon.F.toObject(poseidonNullifierHash));
    assert.propertyVal(witness, "main.nullifierHash", nullifier);

    console.log("nullifier hash computed correctly");

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      sampleInput,
      "/Users/jbel/priv-poll/circuits/build_16/ecdsa-semaphore_js/ecdsa-semaphore_16.wasm",
      "/Users/jbel/priv-poll/circuits/build_16/ecdsa-semaphore_js/ecdsa-semaphore_16.zkey"
    );

    console.log("generated proof");

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
      "/Users/jbel/priv-poll/circuits/build_16/ecdsa-semaphore_js/ecdsa-semaphore_16.vkey.json",
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
