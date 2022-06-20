require('hardhat-circom');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.6.7",
  circom: {
    inputBasePath: "./circuits",
    ptau: "https://hermezptau.blob.core.windows.net/ptau/powersOfTau28_hez_final_15.ptau",
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
