const hre = require("hardhat");
const { buildMimcSponge } = require("circomlibjs");

describe("hash circuit", () => {
  let circuit;
  let mimc;

  const mimcKey = 0;
  const mimcNumOutputs = 1;
  const sampleInput = {
    x: "1764",
  };
  const sanityCheck = true;

  before(async () => {
    mimc = await buildMimcSponge();
    circuit = await hre.circuitTest.setup("hash");
  });

  it("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.checkConstraints(witness);
  });

  it("has the correct output", async () => {
    const mimcResult = mimc.multiHash([sampleInput.x], mimcKey, mimcNumOutputs);
    const expected = { out: mimc.F.toObject(mimcResult) };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
