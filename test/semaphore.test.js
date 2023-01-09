const hre = require("hardhat");
const { assert } = require("chai");
const { buildPoseidon } = require("circomlibjs");

describe("testing a simple poll", function () {
  it("should semaphore", async function () {
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
  });
});