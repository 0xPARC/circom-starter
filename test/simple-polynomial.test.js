const hre = require("hardhat");
const assert = require("assert");
const path = require("path");

describe("simple-polynomial circuit", () => {
  let circuit;

  const sampleInput = {
    x: 5,
  };
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("simple-polynomial");
  });

  it("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.checkConstraints(witness);
  });

  // TODO: Does this test make sense? Is it worthwhile?
  // If so, what is a better name?
  it("decorated output", async () => {
    const expected =
      "main.out --> 127\n" +
      "main.x --> 5\n" +
      "main.x_squared --> 25\n" +
      "main.x_cubed --> undefined";

    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    assert.strictEqual(await circuit.getDecoratedOutput(witness), expected);
  });

  it("has the correct output", async () => {
    const expected = { out: 127 };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });

  it("produces valid solidity call data", async () => {
    const { proof, publicSignals } = await hre.snarkjs.plonk.fullProve(
      sampleInput,
      path.join(__dirname, "../circuits/simple-polynomial.wasm"),
      path.join(__dirname, "../circuits/simple-polynomial.zkey")
    );
    console.log(
      await hre.snarkjs.plonk.exportSolidityCallData(proof, publicSignals)
    );
  });
});
