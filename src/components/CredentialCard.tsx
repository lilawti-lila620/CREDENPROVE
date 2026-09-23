import { useState } from "react";
import { callPresentCredentialOnChain, explorerTxUrl, OnChainResult } from "../lib/onchain";

export interface GateState {
  resourceName: string;
  requiredTier: number;
  verifiedCount: number;
  usedNullifiers: Set<string>;
  gateOpen: boolean;
}

type Phase = "unissued" | "ready" | "proving" | "awaiting_signature" | "done" | "error";

const TIERS = [1, 2, 3, 4, 5];

function randomSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function CredentialCard({
  gate,
  onVerified,
  walletApi,
  walletStatus,
}: {
  gate: GateState;
  onVerified: (nullifier?: string) => void;
  walletApi: { coinPublicKey: string; provider?: unknown; walletName?: string } | null;
  walletStatus: string;
}) {
  const [secret, setSecret] = useState<string | null>(null);
  const [tier, setTier] = useState<number>(3);
  const [issuedTier, setIssuedTier] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("unissued");
  const [txResult, setTxResult] = useState<OnChainResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleIssue() {
    const s = randomSecret();
    setSecret(s);
    setIssuedTier(tier);
    setPhase("ready");
  }

  async function handlePresent() {
    let currentSecret = secret;
    if (phase === "error" || !currentSecret) {
      currentSecret = randomSecret();
      setSecret(currentSecret);
    }
    if (issuedTier === null) return;
    setErrorMsg(null);

    if (!walletApi) {
      setErrorMsg("Please connect your wallet to present a credential on-chain.");
      setPhase("error");
      return;
    }

    setPhase("awaiting_signature");
    const result = await callPresentCredentialOnChain(currentSecret, issuedTier, walletApi);
    if (result.ok) {
      setTxResult(result);
      setPhase("done");
      onVerified(result.nullifier);
    } else {
      let friendlyError = result.error;
      if (result.error.includes("182")) {
        friendlyError = "Transaction rejected by node (Error 182). A fresh credential secret has been generated. Please wait ~30 seconds for your DUST to mature and try again.";
        setSecret(randomSecret());
      } else if (result.error.includes("temporarily banned")) {
        friendlyError = "Your wallet is temporarily rate-limited. Please wait ~60 seconds and try again.";
        setSecret(randomSecret());
      }
      setErrorMsg(friendlyError);
      setPhase("error");
    }
  }

  if (!gate.gateOpen && phase !== "done") {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-brass/5 blur-xl -z-10"></div>
        <p className="font-display text-2xl text-white font-bold tracking-wide">This gate has closed.</p>
        <p className="text-sm text-paper-dim mt-2">
          Verifications already recorded remain valid.
        </p>
      </div>
    );
  }

  const walletConnected = walletStatus === "connected" && !!walletApi;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden relative shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 bg-gradient-to-br from-verdigris/5 to-brass/5 mix-blend-screen pointer-events-none -z-10" />
      <div className="p-10 relative">
        <p className="font-mono text-xs tracking-widest text-verdigris uppercase font-semibold">
          gate · {gate.resourceName}
        </p>
        <h2 className="font-display text-3xl text-white mt-2 mb-2 font-bold tracking-wide">
          {gate.resourceName}
        </h2>
        <p className="text-sm text-paper-dim mb-8">
          Requires a credential at Tier {gate.requiredTier} or above.
        </p>

        {!walletConnected && phase === "unissued" && (
          <div className="mb-6 px-4 py-3 bg-brass/10 border border-brass/40 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(255,0,160,0.15)]">
            <span className="text-brass text-xl drop-shadow-[0_0_5px_rgba(255,0,160,0.8)]">⚠</span>
            <p className="text-sm text-white font-medium">
              Connect your 1AM wallet to submit real on-chain proofs.
            </p>
          </div>
        )}

        {phase === "unissued" && (
          <div className="space-y-6">
            <p className="text-sm text-paper-dim leading-relaxed">
              Choose the tier your credential was issued at. This value stays on
              your device — never disclosed, even when it clears the gate.
            </p>
            <div className="flex gap-3">
              {TIERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`flex-1 font-mono text-lg rounded-xl py-3 border transition-all duration-300 font-bold ${
                    tier === t
                      ? "border-verdigris text-verdigris bg-verdigris/10 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                      : "border-white/10 text-paper-dim hover:border-white/30 hover:bg-white/5"
                  }`}
                >
                  T{t}
                </button>
              ))}
            </div>
            <button
              onClick={handleIssue}
              className="w-full font-mono font-bold tracking-widest uppercase text-sm bg-white text-graphite rounded-xl py-4 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300"
            >
              issue credential
            </button>
          </div>
        )}

        {/* Success state */}
        {phase === "done" && (
          <div className="space-y-6">
            <div className="rounded-xl p-[1px] bg-gradient-to-r from-verdigris to-verdigris-light shadow-[0_0_20px_rgba(0,243,255,0.3)]">
              <div className="bg-graphite-deep rounded-xl px-5 py-4 flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">
                  <path
                    d="M4 12l5 5L20 6"
                    stroke="#00f3ff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-base font-bold text-white tracking-wide">
                  Credential verified — access granted.
                </span>
              </div>
            </div>

            {txResult?.ok && (
              <div className="border border-verdigris/40 rounded-xl p-5 bg-verdigris/10 space-y-3 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                <p className="text-[11px] text-verdigris uppercase tracking-widest font-semibold">
                  On-chain Transaction
                </p>
                <p className="font-mono text-sm text-white break-all">
                  {txResult.txId}
                </p>
                <a
                  href={explorerTxUrl(txResult.txId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="tx-explorer-link"
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-verdigris border border-verdigris/50 rounded-lg px-4 py-2 hover:bg-verdigris/20 transition-all"
                >
                  ↗ verify on Midnight Explorer
                </a>
                <p className="text-[11px] text-paper-dim mt-2">
                  This transaction is publicly verifiable on Midnight Preprod.
                </p>
              </div>
            )}

            {(!txResult || !txResult.ok) && (
              <div className="border border-brass/30 rounded-xl p-5 bg-brass/10 space-y-2 shadow-[0_0_15px_rgba(255,0,160,0.1)]">
                <p className="text-[11px] text-brass uppercase tracking-widest font-semibold">error</p>
                <p className="font-mono text-sm text-white break-all">
                  Transaction failed.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Ready / Proving / Error states */}
        {(phase === "ready" || phase === "proving" || phase === "awaiting_signature" || phase === "error") && (
          <div className="space-y-6">
            <div className="border border-white/10 rounded-xl px-5 py-4 flex items-center justify-between bg-white/5 backdrop-blur-md">
              <span className="text-base font-medium text-white">Holding a credential</span>
              <span className="font-mono text-xs font-bold text-verdigris uppercase tracking-widest border border-verdigris/30 px-2 py-1 rounded bg-verdigris/10">tier withheld</span>
            </div>

            {phase === "awaiting_signature" && (
              <div className="border border-verdigris/40 bg-verdigris/10 shadow-[0_0_15px_rgba(0,243,255,0.15)] rounded-xl px-5 py-4 flex items-center gap-4">
                <span className="inline-block h-6 w-6 rounded-full border-4 border-verdigris/30 border-t-verdigris animate-spin shrink-0" />
                <div>
                  <p className="text-base text-white font-bold tracking-wide">
                    Waiting for wallet signature…
                  </p>
                  <p className="text-sm text-paper-dim mt-1">
                    Check your wallet popup to approve the transaction.
                  </p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="space-y-3">
                <p className="text-base text-white font-medium border border-brass/40 bg-brass/10 shadow-[0_0_15px_rgba(255,0,160,0.15)] rounded-xl px-5 py-4">
                  {errorMsg}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setPhase("unissued");
                  }}
                  className="text-xs font-mono font-bold text-paper-dim hover:text-white uppercase tracking-widest w-full py-2 transition-colors"
                >
                  ← choose tier / issue fresh credential
                </button>
              </div>
            )}

            <button
              onClick={handlePresent}
              disabled={phase === "proving" || phase === "awaiting_signature"}
              id="present-credential-btn"
              className="w-full font-mono text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-verdigris to-brass text-white rounded-xl py-4 transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 hover:bg-transparent transition-colors"></div>
              {phase === "proving" ? (
                <>
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin z-10" />
                  <span className="z-10">generating proof…</span>
                </>
              ) : phase === "awaiting_signature" ? (
                <>
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin z-10" />
                  <span className="z-10">awaiting signature…</span>
                </>
              ) : walletConnected ? (
                <span className="z-10">prove & submit on-chain ↗</span>
              ) : (
                <span className="z-10">prove & present credential</span>
              )}
            </button>

            {walletConnected && phase === "ready" && (
              <p className="text-xs font-medium text-paper-dim text-center">
                Your wallet will open for signature approval.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="px-10 py-4 bg-white/5 backdrop-blur-md border-t border-white/10 flex justify-between items-center">
        <span className="font-mono text-xs text-paper-dim uppercase tracking-wider font-semibold">
          {gate.verifiedCount} verification{gate.verifiedCount === 1 ? "" : "s"} recorded
        </span>
        <span className="font-mono text-xs text-verdigris uppercase tracking-widest font-bold">
          {gate.gateOpen ? "open" : "closed"}
        </span>
      </div>
    </div>
  );
}
