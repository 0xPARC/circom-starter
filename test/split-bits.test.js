const hre = require("hardhat");
const { assert } = require("chai");

//
describe("split-bits test", () => {
  let circuit;

  const sampleInput = {
    in: "15",
  };
  const sanityCheck = true;

  // before(async () => {
  //   circuit = await hre.circuitTest.setup("split-bits");
  // });

  it("setting up circuit", async () => {
    circuit = await hre.circuitTest.setup("split-bits");
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

    assert.propertyVal(witness, "main.chunks[0]", "1");
    assert.propertyVal(witness, "main.chunks[1]", "1");
    assert.propertyVal(witness, "main.chunks[2]", "1");
    assert.propertyVal(witness, "main.chunks[3]", "1");
  });
});
const hre = require("hardhat");
const { assert } = require("chai");

//
describe("split-bits test", () => {
  let circuit;

  const sampleInput = {
    in: "15",
  };
  const sanityCheck = true;

  // before(async () => {
  //   circuit = await hre.circuitTest.setup("split-bits");
  // });

  it("setting up circuit", async () => {
    circuit = await hre.circuitTest.setup("split-bits");
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

    assert.propertyVal(witness, "main.chunks[0]", "1");
    assert.propertyVal(witness, "main.chunks[1]", "1");
    assert.propertyVal(witness, "main.chunks[2]", "1");
    assert.propertyVal(witness, "main.chunks[3]", "1");
  });
});
