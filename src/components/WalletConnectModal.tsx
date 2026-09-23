import { useState } from "react";
import { DiscoveredWallet, WalletId } from "../hooks/useLaceWallet";

export function WalletConnectModal({
  wallets,
  onSelectWallet,
  onCancel,
}: {
  wallets: DiscoveredWallet[];
  onSelectWallet: (walletId: WalletId) => void;
  onCancel: () => void;
}) {
  const has1am = wallets.find((w) => w.id === "1am" && w.installed);
  const hasLace = wallets.find((w) => w.id === "lace" && w.installed);
  const [selectedWalletId, setSelectedWalletId] = useState<WalletId>(
    has1am ? "1am" : hasLace ? "lace" : "1am"
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="glass-panel border-white/20 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(0,243,255,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute inset-0 bg-gradient-to-br from-verdigris/5 to-brass/5 pointer-events-none -z-10" />
          
          {/* Header */}
          <div className="px-8 pt-8 pb-5 border-b border-white/10 flex items-center justify-between relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                  <rect x="6" y="6" width="52" height="52" rx="12" fill="#0d0221" />
                  <rect x="6" y="6" width="52" height="52" rx="12" stroke="#00f3ff" strokeWidth="2" />
                  <circle cx="32" cy="32" r="14" stroke="#ff00a0" strokeWidth="3" />
                  <circle cx="32" cy="32" r="5" fill="#00f3ff" className="animate-pulse" />
                </svg>
              </div>
              <div>
                <p id="wallet-modal-title" className="font-display text-xl font-bold text-white tracking-wide">
                  Connect Wallet
                </p>
                <p className="font-mono text-[10px] text-verdigris uppercase tracking-widest mt-1">
                  Midnight Preprod
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-paper-dim hover:text-white font-mono text-xl px-2 py-1 rounded transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6">
            <p className="text-sm text-paper-dim leading-relaxed">
              Select your Midnight wallet to sign transactions and submit zero-knowledge proofs on-chain:
            </p>

            {/* Wallet Selection List */}
            <div className="space-y-3">
              {/* 1AM Wallet Option */}
              <button
                type="button"
                onClick={() => setSelectedWalletId("1am")}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                  selectedWalletId === "1am"
                    ? "border-verdigris bg-verdigris/10 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-500/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                    <span className="font-display font-bold text-sm text-indigo-300 tracking-wider">
                      1AM
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-white tracking-wide">
                        1AM Wallet
                      </span>
                      {has1am ? (
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest bg-verdigris/20 text-verdigris px-2 py-1 rounded border border-verdigris/30">
                          Detected
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest bg-white/10 text-paper-dim px-2 py-1 rounded">
                          Extension
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-paper-dim mt-1 font-medium">
                      Delegated proof provider & dust sponsorship
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedWalletId === "1am"
                      ? "border-verdigris"
                      : "border-white/30"
                  }`}
                >
                  {selectedWalletId === "1am" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-verdigris shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
                  )}
                </div>
              </button>

              {/* Lace Wallet Option */}
              <button
                type="button"
                onClick={() => setSelectedWalletId("lace")}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                  selectedWalletId === "lace"
                    ? "border-verdigris bg-verdigris/10 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-500/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" stroke="#F59E0B" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" fill="#F59E0B" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-white tracking-wide">
                        Lace Wallet
                      </span>
                      {hasLace ? (
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest bg-verdigris/20 text-verdigris px-2 py-1 rounded border border-verdigris/30">
                          Detected
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest bg-white/10 text-paper-dim px-2 py-1 rounded">
                          Extension
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-paper-dim mt-1 font-medium">
                      Midnight Lace connector (Preprod)
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedWalletId === "lace"
                      ? "border-verdigris"
                      : "border-white/30"
                  }`}
                >
                  {selectedWalletId === "lace" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-verdigris shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
                  )}
                </div>
              </button>
            </div>

            {/* Info Checklist */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              {[
                "Wallet prompt appears to authorize each on-chain transaction",
                "Every proof is recorded on Midnight Preprod blockchain",
                "Transaction hash links directly to Midnight Explorer",
                "Zero-knowledge privacy: credential secrets stay in your browser",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 shrink-0 drop-shadow-[0_0_3px_rgba(0,243,255,0.8)]"
                  >
                    <path
                      d="M4 12l5 5L20 6"
                      stroke="#00f3ff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xs text-paper-dim leading-tight font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Network Badge */}
            <div className="flex items-center justify-between text-xs px-2 pt-2">
              <span className="font-mono text-[10px] uppercase font-bold text-paper-dim flex items-center gap-2 tracking-wider">
                <span className="w-2 h-2 rounded-full bg-verdigris inline-block shadow-[0_0_5px_rgba(0,243,255,0.8)] animate-pulse" />
                Midnight Preprod
              </span>
              <span className="font-mono text-[10px] uppercase font-bold text-paper-dim tracking-wider">
                Auto-reconnect enabled
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 pb-8 flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 font-mono text-xs font-bold uppercase tracking-widest text-paper-dim border border-white/20 rounded-xl py-4 hover:border-brass/50 hover:text-brass transition-all bg-white/5 hover:bg-white/10"
            >
              cancel
            </button>
            <button
              type="button"
              onClick={() => onSelectWallet(selectedWalletId)}
              id="wallet-modal-confirm-btn"
              className="flex-1 font-mono text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-verdigris to-brass text-white rounded-xl py-4 hover:shadow-[0_0_20px_rgba(255,0,160,0.4)] transition-all"
            >
              connect {selectedWalletId === "1am" ? "1AM" : "Lace"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
