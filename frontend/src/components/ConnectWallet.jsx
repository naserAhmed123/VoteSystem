import { useCallback, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { HARDHAT_CHAIN_ID_HEX } from "../contract.js";

async function switchToHardhatLocal(ethereum) {
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: HARDHAT_CHAIN_ID_HEX }],
    });
  } catch (err) {
    if (err?.code === 4902) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: HARDHAT_CHAIN_ID_HEX,
            chainName: "Hardhat Local",
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["http://127.0.0.1:8545"],
          },
        ],
      });
      return;
    }
    throw err;
  }
}

async function attachWallet(ethereum, requestPermission) {
  if (requestPermission) {
    await ethereum.request({ method: "eth_requestAccounts" });
  } else {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (!accounts?.length) return null;
  }
  await switchToHardhatLocal(ethereum);
  const provider = new BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const addr = await signer.getAddress();
  return { signer, address: addr };
}

export default function ConnectWallet({ onConnected, onDisconnected }) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const trySilentReconnect = useCallback(async () => {
    const ethereum = window.ethereum;
    if (!ethereum) return;
    try {
      const session = await attachWallet(ethereum, false);
      if (!session) return;
      setAddress(session.address);
      onConnected(session.signer);
    } catch {
      /* silent */
    }
  }, [onConnected]);

  useEffect(() => {
    trySilentReconnect();
  }, [trySilentReconnect]);

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth?.on) return;
    const onChainChanged = () => window.location.reload();
    const onAccountsChanged = (accounts) => {
      if (!accounts?.length) {
        setAddress("");
        onDisconnected?.();
        return;
      }
      trySilentReconnect();
    };
    eth.on("chainChanged", onChainChanged);
    eth.on("accountsChanged", onAccountsChanged);
    return () => {
      eth.removeListener?.("chainChanged", onChainChanged);
      eth.removeListener?.("accountsChanged", onAccountsChanged);
    };
  }, [onDisconnected, trySilentReconnect]);

  async function connect() {
    setError("");
    const ethereum = window.ethereum;
    if (!ethereum) {
      setError("Install MetaMask to use this DApp.");
      return;
    }
    try {
      const session = await attachWallet(ethereum, true);
      if (!session) return;
      setAddress(session.address);
      onConnected(session.signer);
    } catch (e) {
      setError(e?.shortMessage || e?.message || "Connection failed");
    }
  }

  return (
    <section className="card">
      <div className="card__head">
        <span className="step-pill" aria-hidden="true">
          1
        </span>
        <h2>Wallet</h2>
      </div>
      <div className="card__body">
        <p className="msg">
          Switches MetaMask to <strong>Hardhat Local</strong> (<code>31337</code>). Start{" "}
          <code>npx hardhat node</code> first.
        </p>
        <button type="button" className="btn" onClick={connect}>
          Connect MetaMask
        </button>
        {address && (
          <div className="address-chip" role="status">
            <span className="address-chip__label">Connected</span>
            {address}
          </div>
        )}
        {error && <p className="msg error">{error}</p>}
      </div>
    </section>
  );
}
