import { useEffect, useState } from "react";
import { Contract } from "ethers";
import {
  assertContractDeployed,
  CONTRACT_ADDRESS,
  NO_CONTRACT_AT_ADDRESS_MSG,
  VOTING_ABI,
} from "../contract.js";

export default function Vote({ signer, onVoted }) {
  const [candidates, setCandidates] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  useEffect(() => {
    if (!signer || !CONTRACT_ADDRESS) {
      setCandidates([]);
      setAlreadyVoted(false);
      setMsg("");
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setMsg("");
      try {
        await assertContractDeployed(signer.provider, CONTRACT_ADDRESS);
        const contract = new Contract(CONTRACT_ADDRESS, VOTING_ABI, signer);
        const names = await contract.getCandidates();
        const addr = await signer.getAddress();
        const voted = await contract.hasVoted(addr);
        if (!cancelled) {
          setCandidates([...names]);
          setAlreadyVoted(voted);
        }
      } catch (e) {
        if (!cancelled) {
          const text = e?.shortMessage || e?.message || "Could not load candidates";
          setMsg(/decode|not a contract|BAD_DATA/i.test(text) ? NO_CONTRACT_AT_ADDRESS_MSG : text);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [signer]);

  async function submitVote(candidateId) {
    if (!signer || !CONTRACT_ADDRESS) return;
    setBusy(true);
    setMsg("");
    try {
      const contract = new Contract(CONTRACT_ADDRESS, VOTING_ABI, signer);
      const tx = await contract.vote(candidateId);
      setMsg("Waiting for confirmation…");
      await tx.wait();
      setAlreadyVoted(true);
      setMsg("Vote recorded on chain.");
      if (onVoted) onVoted();
    } catch (e) {
      const text = e?.shortMessage || e?.message || "Vote failed";
      setMsg(/decode|not a contract|BAD_DATA/i.test(text) ? NO_CONTRACT_AT_ADDRESS_MSG : text);
    } finally {
      setBusy(false);
    }
  }

  if (!CONTRACT_ADDRESS) {
    return (
      <section className="card">
        <div className="card__head">
          <span className="step-pill">2</span>
          <h2>Vote</h2>
        </div>
        <div className="card__body">
          <p className="msg error">
            Set <code>VITE_CONTRACT_ADDRESS</code> in <code>frontend/.env</code> after deploy.
          </p>
        </div>
      </section>
    );
  }

  if (!signer) {
    return (
      <section className="card">
        <div className="card__head">
          <span className="step-pill">2</span>
          <h2>Vote</h2>
        </div>
        <div className="card__body">
          <p className="msg">Connect your wallet in step 1.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card__head">
        <span className="step-pill">2</span>
        <h2>Vote</h2>
      </div>
      <div className="card__body">
        {loading && (
          <>
            <p className="msg">Loading candidates from the contract…</p>
            <div className="loading-line" aria-hidden="true" />
          </>
        )}
        {!loading && alreadyVoted && (
          <p className="msg ok">You have already voted — one vote per address on-chain.</p>
        )}
        {!loading && !alreadyVoted && candidates.length > 0 && (
          <>
            <p className="msg">Pick one candidate. Each wallet can vote once.</p>
            <ul className="candidate-list">
              {candidates.map((name, candidateId) => (
                <li key={candidateId}>
                  <div>
                    <span className="candidate-name">{name}</span>
                    <span className="candidate-meta">Candidate #{candidateId}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn--sm btn--outline"
                    disabled={busy}
                    onClick={() => submitVote(candidateId)}
                  >
                    Vote
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {!loading && !alreadyVoted && candidates.length === 0 && !msg && (
          <p className="msg">No candidates — check contract address and network.</p>
        )}
        {msg && (
          <p
            className={`msg ${
              msg.includes("recorded")
                ? "ok"
                : msg.includes("Waiting") || msg.includes("Loading")
                  ? "muted-hint"
                  : "error"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </section>
  );
}
