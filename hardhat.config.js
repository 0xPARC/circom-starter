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
    ptau: "https://hermezptau.blob.core.windows.net/ptau/powersOfTau28_hez_final_20.ptau",
    // ptau: "./ptau/pot20_final.ptau",
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
      url: `https://goerli.infura.io/v3/c87d47d90d134701ae50e884362ae262`, // <---- YOUR INFURA ID! (or it won't work)
      accounts: [
        "0xce4c9b64990b51fb4f532b0366f2182a310a472772fef7b27c4fae602357067a",
      ],
      // url: process.env.GOERLI_RPC_URL, // <---- YOUR INFURA ID! (or it won't work)
      // accounts: [process.env.GOERLI_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
