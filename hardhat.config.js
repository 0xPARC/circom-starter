require('hardhat-circom');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.6.7",
  circom: {
    ptau: "hash.ptau",
    circuits: [
      {
        name: `hash`,
      },
    ],
  },
};
