import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import {
  assertContractDeployed,
  CONTRACT_ADDRESS,
  NO_CONTRACT_AT_ADDRESS_MSG,
  VOTING_ABI,
} from "../contract.js";

export default function Results({ signer, refreshKey }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!CONTRACT_ADDRESS) {
      setError("Set VITE_CONTRACT_ADDRESS in frontend/.env after deploy.");
      setRows([]);
      return;
    }

    const eth = window.ethereum;
    if (!signer && !eth) {
      setError("Install MetaMask to read on-chain results.");
      setRows([]);
      return;
    }

    let cancelled = false;

    async function fetchResults() {
      setLoading(true);
      setError("");
      try {
        const provider = signer ? signer.provider : new BrowserProvider(eth);
        await assertContractDeployed(provider, CONTRACT_ADDRESS);
        const contract = new Contract(CONTRACT_ADDRESS, VOTING_ABI, provider);
        const names = await contract.getCandidates();
        const counts = await contract.getResults();
        const nextRows = names.map((name, i) => ({
          name,
          count: (counts[i] ?? 0n).toString(),
        }));
        if (!cancelled) setRows(nextRows);
      } catch (e) {
        if (!cancelled) {
          const text = e?.shortMessage || e?.message || "Could not load results";
          setError(/decode|not a contract|BAD_DATA/i.test(text) ? NO_CONTRACT_AT_ADDRESS_MSG : text);
          setRows([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchResults();
    return () => {
      cancelled = true;
    };
  }, [signer, refreshKey]);

  if (!CONTRACT_ADDRESS) {
    return (
      <section className="card">
        <div className="card__head">
          <span className="step-pill">3</span>
          <h2>Results</h2>
        </div>
        <div className="card__body">
          <p className="msg error">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card__head">
        <span className="step-pill">3</span>
        <h2>Results</h2>
      </div>
      <div className="card__body">
        <p className="msg">Live tallies stored on the blockchain.</p>
        {loading && (
          <>
            <p className="muted-hint">Syncing…</p>
            <div className="loading-line" aria-hidden="true" />
          </>
        )}
        {error && <p className="msg error">{error}</p>}
        {!loading && !error && rows.length > 0 && (
          <div className="results-wrap">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Votes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`${r.name}-${i}`}>
                    <td>{r.name}</td>
                    <td>{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
