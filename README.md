<<<<<<< HEAD
# 🗳️ Blockchain Voting DApp

![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-blue)
![React](https://img.shields.io/badge/React-Vite-61DAFB)
![Ethers.js](https://img.shields.io/badge/Ethers.js-v6-purple)
![Hardhat](https://img.shields.io/badge/Hardhat-local-yellow)
![Status](https://img.shields.io/badge/status-educational-orange)
![License](https://img.shields.io/badge/license-MIT-green)

A simple decentralized voting application built with Solidity, Hardhat, React, and Ethers.js. Users connect via MetaMask and vote securely on-chain with one vote per wallet.

---

## 🚀 Features

- ✅ Smart contract handles candidates and votes  
- 🔒 One vote per wallet (enforced on-chain)  
- ⚡ Real-time results from blockchain  
- 🦊 MetaMask integration  
- 🌐 No backend, fully decentralized  

---

## 🛠️ Tech Stack

- Solidity  
- Hardhat  
- React (Vite)  
- Ethers.js v6  
- MetaMask  

---

## 📸 Screenshots

### 🔹 App Interface
<p align="center">
  <img src="assets/appInterface.png" width="600"/>
</p>

### 🔹 Wallet Connection
<p align="center">
  <img src="assets/AppwithMeta.png" width="600"/>
</p>

### 🔹 Voting Results
<p align="center">
  <img src="assets/ResultOfVote.png" width="600"/>
</p>

---

## ⚙️ How to Run

### 1. Start Hardhat node
```bash
npx hardhat node
2. Deploy contract
npm run deploy

Copy contract address to:

frontend/.env

VITE_CONTRACT_ADDRESS=0x...
3. Run frontend
cd frontend
npm run dev
4. MetaMask Setup
RPC: http://127.0.0.1:8545
Chain ID: 31337
Import test account from Hardhat
📌 Notes
Restarting Hardhat = blockchain reset → redeploy required
Wrong contract address = app won’t work
Ignore minor Hardhat logs if voting works
📄 License

This project is for educational purposes only.
# 🗳️ Blockchain Voting DApp

![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-blue)
![React](https://img.shields.io/badge/React-Vite-61DAFB)
![Ethers.js](https://img.shields.io/badge/Ethers.js-v6-purple)
![Hardhat](https://img.shields.io/badge/Hardhat-local-yellow)
![Status](https://img.shields.io/badge/status-educational-orange)
![License](https://img.shields.io/badge/license-MIT-green)

A simple Blockchain Voting DApp built with Solidity, Hardhat, React, and Ethers.js. Users connect via MetaMask to vote securely on-chain, with one vote per wallet enforced by smart contract. Runs on a local Hardhat network with no backend or database required.

---

## 🚀 Features

- ✅ Smart contract handles candidates and votes  
- 🔒 One vote per wallet (enforced on-chain)  
- ⚡ Real-time results from blockchain  
- 🦊 MetaMask integration  
- 🌐 No backend, fully decentralized  

---

## 🛠️ Tech Stack

- Solidity  
- Hardhat  
- React (Vite)  
- Ethers.js v6  
- MetaMask  

---

## 📸 Screenshots

### 🔹 App Interface
<p align="center">
  <img src="assets/appInterface.png" width="600"/>
</p>

### 🔹 Wallet Connection
<p align="center">
  <img src="assets/AppwithMeta.png" width="600"/>
</p>

### 🔹 Voting Results
<p align="center">
  <img src="assets/ResultOfVote.png" width="600"/>
</p>

---

## ⚙️ How to Run

### 1. Start Hardhat node
```bash
npx hardhat node
2. Deploy contract
npm run deploy

Copy contract address to:

frontend/.env

VITE_CONTRACT_ADDRESS=0x...
3. Run frontend
cd frontend
npm run dev
4. MetaMask Setup
RPC: http://127.0.0.1:8545
Chain ID: 31337
Import test account from Hardhat
📌 Notes
Restarting Hardhat = blockchain reset → redeploy required
Wrong contract address = app won’t work
Ignore minor Hardhat logs if voting works
📄 License

This project is for educational purposes only.
