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
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-amber-50 blur-xl -z-10"></div>
        <p className="font-display text-2xl text-slate-900 font-bold tracking-wide">This gate has closed.</p>
        <p className="text-sm text-slate-500 mt-2">
          Verifications already recorded remain valid.
        </p>
      </div>
    );
  }

  const walletConnected = walletStatus === "connected" && !!walletApi;

  return (
    <div className="bg-white rounded-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 pointer-events-none -z-10" />
      <div className="p-10 relative">
        <p className="font-mono text-xs tracking-widest text-blue-600 uppercase font-semibold">
          gate · {gate.resourceName}
        </p>
        <h2 className="font-display text-3xl text-slate-900 mt-2 mb-2 font-bold tracking-wide">
          {gate.resourceName}
        </h2>
        <p className="text-sm text-slate-600 mb-8">
          Requires a credential at Tier {gate.requiredTier} or above.
        </p>

        {!walletConnected && phase === "unissued" && (
          <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 shadow-sm">
            <span className="text-amber-500 text-xl">⚠</span>
            <p className="text-sm text-slate-800 font-medium">
              Connect your 1AM wallet to submit real on-chain proofs.
            </p>
          </div>
        )}

        {phase === "unissued" && (
          <div className="space-y-6">
            <p className="text-sm text-slate-600 leading-relaxed">
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
                      ? "border-blue-500 text-blue-600 bg-blue-50 shadow-sm"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  T{t}
                </button>
              ))}
            </div>
            <button
              onClick={handleIssue}
              className="w-full font-mono font-bold tracking-widest uppercase text-sm bg-slate-900 text-white rounded-xl py-4 hover:bg-slate-800 shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              issue credential
            </button>
          </div>
        )}

        {/* Success state */}
        {phase === "done" && (
          <div className="space-y-6">
            <div className="rounded-xl p-[1px] bg-gradient-to-r from-blue-400 to-indigo-400 shadow-sm">
              <div className="bg-white rounded-xl px-5 py-4 flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12l5 5L20 6"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-base font-bold text-slate-900 tracking-wide">
                  Credential verified — access granted.
                </span>
              </div>
            </div>

            {txResult?.ok && (
              <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 space-y-3 shadow-sm">
                <p className="text-[11px] text-blue-600 uppercase tracking-widest font-semibold">
                  On-chain Transaction
                </p>
                <p className="font-mono text-sm text-slate-800 break-all">
                  {txResult.txId}
                </p>
                <a
                  href={explorerTxUrl(txResult.txId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="tx-explorer-link"
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-blue-700 border border-blue-300 rounded-lg px-4 py-2 hover:bg-blue-100 transition-all bg-white"
                >
                  ↗ verify on Midnight Explorer
                </a>
                <p className="text-[11px] text-slate-500 mt-2">
                  This transaction is publicly verifiable on Midnight Preprod.
                </p>
              </div>
            )}

            {(!txResult || !txResult.ok) && (
              <div className="border border-red-200 rounded-xl p-5 bg-red-50 space-y-2 shadow-sm">
                <p className="text-[11px] text-red-600 uppercase tracking-widest font-semibold">error</p>
                <p className="font-mono text-sm text-slate-900 break-all">
                  Transaction failed.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Ready / Proving / Error states */}
        {(phase === "ready" || phase === "proving" || phase === "awaiting_signature" || phase === "error") && (
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between bg-slate-50">
              <span className="text-base font-medium text-slate-800">Holding a credential</span>
              <span className="font-mono text-xs font-bold text-blue-600 uppercase tracking-widest border border-blue-200 px-2 py-1 rounded bg-blue-50">tier withheld</span>
            </div>

            {phase === "awaiting_signature" && (
              <div className="border border-blue-200 bg-blue-50 shadow-sm rounded-xl px-5 py-4 flex items-center gap-4">
                <span className="inline-block h-6 w-6 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin shrink-0" />
                <div>
                  <p className="text-base text-slate-900 font-bold tracking-wide">
                    Waiting for wallet signature…
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Check your wallet popup to approve the transaction.
                  </p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="space-y-3">
                <p className="text-base text-slate-900 font-medium border border-red-200 bg-red-50 shadow-sm rounded-xl px-5 py-4">
                  {errorMsg}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setPhase("unissued");
                  }}
                  className="text-xs font-mono font-bold text-slate-500 hover:text-slate-800 uppercase tracking-widest w-full py-2 transition-colors"
                >
                  ← choose tier / issue fresh credential
                </button>
              </div>
            )}

            <button
              onClick={handlePresent}
              disabled={phase === "proving" || phase === "awaiting_signature"}
              id="present-credential-btn"
              className="w-full font-mono text-sm font-bold tracking-widest uppercase bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg flex items-center justify-center gap-3 relative overflow-hidden"
            >
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
              <p className="text-xs font-medium text-slate-500 text-center">
                Your wallet will open for signature approval.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="px-10 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
        <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
          {gate.verifiedCount} verification{gate.verifiedCount === 1 ? "" : "s"} recorded
        </span>
        <span className="font-mono text-xs text-blue-600 uppercase tracking-widest font-bold">
          {gate.gateOpen ? "open" : "closed"}
        </span>
      </div>
    </div>
  );
}
