require("hardhat-circom");
require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.11",
      },
      {
        version: "0.8.9",
      },
      {
        version: "0.8.4",
      },
    ],
  },
  circom: {
    inputBasePath: "./circuits",
    ptau: "https://hermezptau.blob.core.windows.net/ptau/powersOfTau28_hez_final_15.ptau",
    circuits: [
      {
        name: "division",
        // No protocol, so it defaults to groth16
      },
      {
        name: "simple-polynomial",
        // Generate PLONK
        protocol: "plonk",
      },
      {
        name: "hash",
        // Explicitly generate groth16
        protocol: "groth16",
      },
      {
        name: "semaphore",
        // No protocol, so it defaults to groth16
      },
    ],
  },
  networks: {
    hardhat: {
    },
    goerli: {
      url: `https://goerli.infura.io/v3/c87d47d90d134701ae50e884362ae262`, // <---- YOUR INFURA ID! (or it won't work)
      accounts: ["0xce4c9b64990b51fb4f532b0366f2182a310a472772fef7b27c4fae602357067a"],
    },
  },
};
