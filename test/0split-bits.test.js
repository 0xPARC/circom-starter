const hre = require("hardhat");
const { assert } = require("chai");

//
describe("split-bit test", () => {
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

    console.log(witness);
    assert.propertyVal(witness, "main.in", sampleInput.in);
    assert.propertyVal(witness, "main.chunk1", 1);
    console.log("passed1");
    assert.propertyVal(witness, "main.chunk2", 1);
    assert.propertyVal(witness, "main.chunk3", 1);
    assert.propertyVal(witness, "main.chunk4", 1);
  });
});
