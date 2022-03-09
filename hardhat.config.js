require('hardhat-circom');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.6.7",
  circom: {
    inputBasePath: "./circuits",
    ptau: "pot15_final.ptau",
    circuits: [
      {
        name: "division"
        // No protocol, so it defaults to groth16
      },
      {
        name: "simple-polynomial",
        // Generate PLONK
        protocol: 'plonk'
      },
      {
        name: "hash",
        // Explicitly generate groth16
        protocol: "groth16"
      }
    ],
  },
};
