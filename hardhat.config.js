require("hardhat-circom");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: __dirname + "/.env" });
require("@nomiclabs/hardhat-etherscan");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.6.11",
      },
    ],
  },
  circom: {
    inputBasePath: "./circuits",
    ptau: "https://hermezptau.blob.core.windows.net/ptau/powersOfTau28_hez_final_15.ptau",
    // ptau: "ptau/powersOfTau28_hez_final_18.ptau",
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
      {
        name: "ecdsa-semaphore",
        // No protocol, so it defaults to groth16
      },
      {
        name: "split-bits",
        // No protocol, so it defaults to groth16
      },
      {
        name: "ecdsa",
        // No protocol, so it defaults to groth16
      },
      {
        name: "eth_addr",
        // No protocol, so it defaults to groth16
      },
    ],
  },
  networks: {
    hardhat: {},
    goerli: {
      url: process.env.GOERLI_RPC_URL, // <---- YOUR INFURA ID! (or it won't work)
      accounts: [process.env.GOERLI_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
