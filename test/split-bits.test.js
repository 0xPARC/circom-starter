const hre = require("hardhat");
const { assert } = require("chai");
const { buildPoseidon } = require("circomlibjs");

describe("split-bit test", () => {
  let circuit;

  const sampleInput = {
    in: "1111",
  };
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("split-bit");
  });

  it("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.checkConstraints(witness);
  });

  it("has expected witness values", async () => {
    const witness = await circuit.calculateLabeledWitness(
      sampleInput,
      sanityCheck
    );

    assert.propertyVal(witness, "main.in", sampleInput.in);
    assert.propertyVal(witness, "main.chunk1", 1);
    assert.propertyVal(witness, "main.chunk2", 1);
    assert.propertyVal(witness, "main.chunk3", 1);
    assert.propertyVal(witness, "main.chunk4", 1);
  });
});
