import { useCallback, useState } from "react";
import ConnectWallet from "./components/ConnectWallet.jsx";
import Vote from "./components/Vote.jsx";
import Results from "./components/Results.jsx";

/**
 * ConnectWallet → Vote → Results (pas d’écran login).
 */
export default function App() {
  const [signer, setSigner] = useState(null);
  const [resultsKey, setResultsKey] = useState(0);

  const handleConnected = useCallback((nextSigner) => {
    setSigner(nextSigner);
  }, []);

  const handleVoted = useCallback(() => {
    setResultsKey((k) => k + 1);
  }, []);

  const handleDisconnected = useCallback(() => {
    setSigner(null);
  }, []);

  return (
    <div className="shell">
      <header className="hero">
        <span className="hero__badge">On-chain</span>
        <h1>Blockchain Voting</h1>
        <p className="hero__lead">React, Ethers.js &amp; Solidity — Hardhat local network</p>
      </header>

      <main className="steps">
        <ConnectWallet onConnected={handleConnected} onDisconnected={handleDisconnected} />
        <Vote signer={signer} onVoted={handleVoted} />
        <Results signer={signer} refreshKey={resultsKey} />
      </main>
    </div>
  );
}
