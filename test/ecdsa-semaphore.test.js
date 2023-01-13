const hre = require("hardhat");
const { assert } = require("chai");
const { buildPoseidon } = require("circomlibjs");

describe("semaphore with ecdsa test", () => {
  let circuit;
  let poseidon;

  const poseidonKey = 0;
  const poseidonNumOutputs = 1;
  const sampleInput = {
    identityNullifier:
      "29980590644713171901284555306875329217885936229213536076981879180646816393547",
    treePathIndices: ["0", "0"],
    treeSiblings: [
      "0x8c564eaA1654be9Dfc68d09972EF86b12e0f6232",
      "3262392604832476992964505822550551305044316855163773416541209973901164748821",
    ],
    signalHash: "1",
    externalNullifier: "0",
  };
  const sanityCheck = true;

  before(async () => {
    console.log("inside before async");
    poseidon = await buildPoseidon();
    console.log("after poseidon");

    circuit = await hre.circuitTest.setup("ecdsa-semaphore");
    console.log("after before async");
    console.log(DateTime);
  });

  console.log("circuit set up");

  it("produces a witness with valid constraints", async () => {
    console.log("before prducing witness");

    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.checkConstraints(witness);
    console.log("after prducing witness");
  });

  it("has expected witness values", async () => {
    const witness = await circuit.calculateLabeledWitness(
      sampleInput,
      sanityCheck
    );

    assert.propertyVal(
      witness,
      "main.identityNullifier",
      sampleInput.identityNullifier
    );

    console.log("private key passed in correctly");

    assert.propertyVal(witness, "main.splitIdentityNullifier", [
      "4776183644706582656",
      "15959983850850840219",
      "3841518606508130495",
      "13515508587766982987",
    ]);

    console.log("split bits working correctly");

    assert.propertyVal(
      witness,
      "main.address",
      "0x36E2B0f0a0D1A89db09f869660850A0f82559BE6"
    );

    console.log("wallet address calculated correctly");

    assert.propertyVal(witness, "main.signalHash", sampleInput.signalHash);

    assert.propertyVal(
      witness,
      "main.signalHashSquared",
      String(parseInt(sampleInput.signalHash) ** 2)
    );

    assert.propertyVal(
      witness,
      "main.root",
      "13206826052089593869502154240258397422964396668200311662359519159824802795199"
    );

    console.log("root calculated correctly");

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
    assert.propertyVal(
      witness,
      "main.nullifierHash",
      String(poseidon.F.toObject(poseidonNullifierHash))
    );
  });
});
