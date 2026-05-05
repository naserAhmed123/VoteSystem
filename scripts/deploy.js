/**
 * Deploy Voting.sol to the network (use --network localhost with `npx hardhat node`).
 * Copy the printed address into frontend/.env as VITE_CONTRACT_ADDRESS=0x...
 */
const hre = require("hardhat");

async function main() {
  // Exactly 3 candidates (allowed: 2 or 3)
  const candidateNames = ["Alice", "Bob", "Charlie"];

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(candidateNames);
  await voting.waitForDeployment();

  const address = await voting.getAddress();
  console.log("Voting deployed to:", address);
  console.log("");
  console.log("Add this line to frontend/.env (create the file if needed):");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
