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
  });

  it("cast a vote (null tree)", async function () {
    // Create a poll
    const merkleRoot =
      "0x0000000000000000000000000000000000000000000000000000000000000123";
    const merkleTreeDepth = "0";
    const pollId = "1";
    await privPoll.createPoll(pollId, coordinator, merkleRoot, merkleTreeDepth);

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

    const path = __dirname;
    const wasmPath = path + "/../circuits/semaphore.wasm";
    const zkeyPath = path + "/../circuits/semaphore.zkey";

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      sampleInput,
      wasmPath,
      zkeyPath
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
    const vkeyPath = path + "/../circuits/semaphore.vkey.json";
    const vkeyStr = fs.readFileSync(vkeyPath, "utf8");

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

    const receipt = await privPoll.castVote(
      vote,
      nullifier,
      pollId,
      proofForTx,
      {
        from: coordinator,
      }
    );

    const getPollResults = await privPoll.getPollState(pollId);
    const yesVotes = getPollResults[0].toString();
    const noVotes = getPollResults[1].toString();
    const status = getPollResults[2];
    assert(yesVotes == "1");

    await privPoll.endPoll(pollId);
  });
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
        merkleTreeDepth: "16",
      },
    ]);
    await privPoll.deployed();
  });

  it("user 101 (pass)", async function () {
    // Create a poll
    const merkleRoot =
      "6619011325389904982938986242293599280972546946234438132005195786216371550779";
    const merkleTreeDepth = "16";
    const pollId = "1";
    await privPoll.createPoll(pollId, coordinator, merkleRoot, merkleTreeDepth);

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
        "1",
        "1",
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
        "10344803844228993379415834281058662700959138333457605334309913075063427817480",
        "19613055433354010593181510296481106659265254887405599851386217491513440263534",
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

    assert.propertyVal(witness, "main.root", merkleRoot);

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

    const path = __dirname;
    const wasmPath = path + "/../circuits/semaphore.wasm";
    const zkeyPath = path + "/../circuits/semaphore.zkey";

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      sampleInput,
      wasmPath,
      zkeyPath
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
    console.log(proofForTx)

    // const contractProofForTx = [
    //   '4162220409527237065352797216195900651011636425549923258068529799673969247617',
    //   '6420471206849550143313613503847350351031733090336710951337110496919073183917',
    //   '13315330991909142217852976644278028559073531735183489896160858827059448222593',
    //   '20108647067663938709539752602115475123832128901697910199680358834008266735018',
    //   '10289380589003181816201053375182155574162089476599698855855435765819666757999',
    //   '1972616014216011584676028593589251034817056695004873827471431572169088914060',
    //   '18953439321805704146504029906924311877526082186501852019022201803533191068113',
    //   '12555186062169447814306556420783600513240713304096410250075009286328331920930'
    // ]
    // const contractNullifier = '2570728153758525455068681255560397293445847326980545556667885052648074786431'
    // const contractPollId = '1'
    // const contractVote = "0x0000000000000000000000000000000000000000000000000000000000000001";

    // console.log("Check 9: ")

    // Read the contents of the JSON file into a string
    const vkeyPath = path + "/../circuits/semaphore.vkey.json";
    const vkeyStr = fs.readFileSync(vkeyPath, "utf8");

    // Parse the JSON string and generate the JSON object
    const vkey = JSON.parse(vkeyStr);

    const proofVerified = await snarkjs.groth16.verify(
      vkey,
      publicSignals,
      proof
    );

    console.log("Check 4: ", proofVerified);

    assert(proofVerified, "Proof did not verify.");

    // Cast a vote
    const vote =
      "0x0000000000000000000000000000000000000000000000000000000000000001";

    // const receipt = await privPoll.castVote(
    //   contractVote,
    //   contractNullifier,
    //   contractPollId,
    //   contractProofForTx,
    //   {
    //     from: coordinator,
    //   }
    // );
    const receipt = await privPoll.castVote(
      vote,
      nullifier,
      pollId,
      proofForTx,
      {
        from: coordinator,
      }
    );

    // console.log(receipt);

    await privPoll.endPoll(pollId);
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
        merkleTreeDepth: "16",
      },
    ]);
    
    await privPoll.deployed();
  });
  it("user 401 (pass)", async function () {
    // Create a poll
    const merkleRoot =
      "6619011325389904982938986242293599280972546946234438132005195786216371550779";
    const merkleTreeDepth = "16";
    const pollId = "1";
    await privPoll.createPoll(pollId, coordinator, merkleRoot, merkleTreeDepth);

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
        "1",
        "1",
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
        "10344803844228993379415834281058662700959138333457605334309913075063427817480",
        "19613055433354010593181510296481106659265254887405599851386217491513440263534",
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

    assert.propertyVal(witness, "main.root", merkleRoot);

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

    const path = __dirname;
    const wasmPath = path + "/../circuits/semaphore.wasm";
    const zkeyPath = path + "/../circuits/semaphore.zkey";

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      sampleInput,
      wasmPath,
      zkeyPath
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
    const vkeyPath = path + "/../circuits/semaphore.vkey.json";
    const vkeyStr = fs.readFileSync(vkeyPath, "utf8");

    const vkey = JSON.parse(vkeyStr);

    const proofVerified = await snarkjs.groth16.verify(
      vkey,
      publicSignals,
      proof
    );

    // Cast a vote
    const vote =
      "0x0000000000000000000000000000000000000000000000000000000000000001";

    // Nullifier Hash not checking correctly
    const castVoteReceipt = await privPoll.castVote(
      vote,
      nullifier,
      pollId,
      proofForTx,
      {
        from: coordinator,
      }
    );

    console.log(castVoteReceipt);

    const getPollResults = await privPoll.getPollState(pollId);
    const yesVotes = getPollResults[0].toString();
    const noVotes = getPollResults[1].toString();
    const status = getPollResults[2];
    assert(yesVotes == "1");

    await privPoll.endPoll(pollId);
  });
});
