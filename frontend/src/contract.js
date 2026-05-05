/**
 * Voting contract wiring for the React app (no backend).
 *
 * Vite injects env vars at build time from `frontend/.env`:
 *   VITE_CONTRACT_ADDRESS=0x...   (required after Hardhat deploy)
 */
const raw = import.meta.env.VITE_CONTRACT_ADDRESS ?? "";

/** Trimmed deploy address; empty string if missing (UI will prompt to set .env). */
export const CONTRACT_ADDRESS =
  typeof raw === "string" ? raw.trim() : "";

/** Hardhat local node uses chain id 31337 (must match MetaMask network). */
export const HARDHAT_CHAIN_ID_HEX = "0x7a69";

/**
 * Shown when eth_getCode is empty — matches Hardhat log:
 * "Calling an account which is not a contract".
 */
export const NO_CONTRACT_AT_ADDRESS_MSG =
  "No contract at this address (or chain was reset). " +
  "Keep Terminal A: npx hardhat node running. " +
  "Terminal B (project root): npm run deploy. " +
  "Copy the printed address into frontend/.env as VITE_CONTRACT_ADDRESS=... then restart npm run dev.";

/**
 * Throws if there is no bytecode at `address` (fixes confusing "could not decode result data").
 * @param {import("ethers").Provider} provider
 * @param {string} address
 */
export async function assertContractDeployed(provider, address) {
  if (!address) throw new Error(NO_CONTRACT_AT_ADDRESS_MSG);
  const code = await provider.getCode(address);
  if (!code || code === "0x") {
    throw new Error(NO_CONTRACT_AT_ADDRESS_MSG);
  }
}

/**
 * Minimal ABI for ethers.js `Contract` — must match `contracts/Voting.sol`.
 * We call: vote(uint256), hasVoted(address), getCandidates(), getResults().
 */
export const VOTING_ABI = [
  {
    inputs: [{ internalType: "string[]", name: "candidateNames", type: "string[]" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "hasVoted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "candidateCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCandidates",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getResults",
    outputs: [{ internalType: "uint256[]", name: "counts", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "candidateIndex", type: "uint256" }],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
