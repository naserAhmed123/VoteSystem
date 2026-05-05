require("@nomicfoundation/hardhat-toolbox");

/** Hardhat config: compile Solidity and talk to local Hardhat node on 8545 */
module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};
