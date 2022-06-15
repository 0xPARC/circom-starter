const hre = require("hardhat");
const assert = require("assert");
const path = require("path");

describe("division circuit", () => {
  let circuit;

  const sampleInput = {
    x1: "13",
    x2: "7",
    x3: "4",
    x4: "2",
  };
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("division");
  });

  it("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.checkConstraints(witness);
  });

  // TODO: Does this test make sense? Is it worthwhile?
  // If so, what is a better name?
  it("decorated output", async () => {
    const expected =
      "main.out --> 3\n" +
      "main.x2 --> 7\n" +
      "main.x1 --> 13\n" +
      "main.x3 --> 4\n" +
      "main.x4 --> 2\n" +
      "main.y1 --> undefined\n" +
      "main.y2 --> undefined";

    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    assert.strictEqual(await circuit.getDecoratedOutput(witness), expected);
  });

  it("has the correct output", async () => {
    const expected = { out: 3 };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });

  it("produces valid solidity call data", async () => {
    const { proof, publicSignals } = await hre.snarkjs.groth16.fullProve(
      sampleInput,
      path.join(__dirname, "../circuits/division.wasm"),
      path.join(__dirname, "../circuits/division.zkey")
    );
    console.log(
      await hre.snarkjs.groth16.exportSolidityCallData(proof, publicSignals)
    );
  });
});
