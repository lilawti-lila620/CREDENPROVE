import { WalletStatus } from "../hooks/useLaceWallet";
import { explorerContractUrl } from "../lib/onchain";

function truncate(addr: string) {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export function Header({
  status,
  address,
  walletName,
  error,
  onConnect,
  onDisconnect,
}: {
  status: WalletStatus;
  address: string | null;
  walletName?: string | null;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <header className="border-b border-white/10 glass-panel sticky top-0 z-50">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <svg width="36" height="36" viewBox="0 0 64 64" className="shrink-0 drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]">
            <rect x="6" y="6" width="52" height="52" rx="12" className="fill-graphite-light" />
            <rect x="6" y="6" width="52" height="52" rx="12" fill="none" stroke="#00f3ff" strokeWidth="2" />
            <circle cx="32" cy="32" r="14" fill="none" stroke="#ff00a0" strokeWidth="3" />
            <circle cx="32" cy="32" r="5" fill="#00f3ff" className="animate-pulse" />
          </svg>
          <div>
            <p className="font-display font-bold text-2xl text-white tracking-wide leading-none">CredProve</p>
            <p className="font-mono text-[10px] text-verdigris uppercase tracking-widest mt-1.5 opacity-80">
              first quarter · midnight builder challenge
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {status === "connected" && address ? (
            <>
              <div className="flex items-center gap-3">
                {/* Wallet badge */}
                {walletName && (
                  <span className="font-mono text-[10px] bg-verdigris/20 text-verdigris px-2 py-0.5 rounded border border-verdigris/30 font-semibold tracking-wider">
                    {walletName}
                  </span>
                )}
                {/* Green dot indicator */}
                <span className="inline-block w-2 h-2 rounded-full bg-verdigris drop-shadow-[0_0_5px_rgba(0,243,255,0.8)] animate-pulse" />
                <span className="font-mono text-sm font-semibold text-white">
                  {truncate(address)}
                </span>
                <button
                  onClick={onDisconnect}
                  className="font-mono text-[10px] text-paper-dim border border-white/20 rounded-md px-2 py-1 hover:border-brass/50 hover:text-brass transition-all duration-300 uppercase tracking-widest bg-white/5"
                  title="Disconnect wallet"
                >
                  disconnect
                </button>
              </div>
              <a
                href={explorerContractUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-paper-dim hover:text-verdigris transition-colors uppercase tracking-widest mt-1"
              >
                ↗ view contract on-chain
              </a>
            </>
          ) : (
            <button
              onClick={onConnect}
              disabled={status === "connecting"}
              id="connect-wallet-btn"
              className="font-mono font-bold text-xs text-white border-none rounded-lg px-5 py-2.5 bg-gradient-to-r from-verdigris to-brass hover:shadow-[0_0_15px_rgba(255,0,160,0.5)] transition-all duration-300 disabled:opacity-50 tracking-widest uppercase"
            >
              {status === "connecting" ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  connecting…
                </span>
              ) : (
                "connect wallet"
              )}
            </button>
          )}
          {(status === "unavailable" || status === "error") && error && (
            <p className="text-[11px] text-brass max-w-[260px] text-right mt-1 font-mono">
              {error}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
