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
    <header className="border-b border-white/10 glass-panel sticky top-0 z-50 shadow-lg">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-verdigris/30 blur-md rounded-xl group-hover:bg-verdigris/50 transition-all duration-300"></div>
            <svg width="40" height="40" viewBox="0 0 64 64" className="relative shrink-0 drop-shadow-[0_0_12px_rgba(0,243,255,1)]">
              <rect x="6" y="6" width="52" height="52" rx="14" className="fill-graphite-deep" />
              <rect x="6" y="6" width="52" height="52" rx="14" fill="none" stroke="url(#logo-grad)" strokeWidth="2" />
              <circle cx="32" cy="32" r="14" fill="none" stroke="#ff00a0" strokeWidth="3" />
              <circle cx="32" cy="32" r="5" fill="#00f3ff" className="animate-pulse" />
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f3ff" />
                  <stop offset="100%" stopColor="#ff00a0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <p className="font-display font-black text-2xl text-white tracking-widest leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-paper-dim">CREDSIGNET</p>
            <p className="font-mono text-[10px] text-verdigris uppercase tracking-widest mt-1.5 opacity-90 font-semibold">
              secure zero-knowledge portal
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {status === "connected" && address ? (
            <>
              <div className="flex items-center gap-3">
                {/* Wallet badge */}
                {walletName && (
                  <span className="font-mono text-[10px] bg-gradient-to-r from-verdigris/20 to-brass/20 text-white px-3 py-1 rounded border border-verdigris/40 font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                    {walletName}
                  </span>
                )}
                {/* Green dot indicator */}
                <div className="relative flex items-center justify-center w-4 h-4">
                  <span className="absolute inline-block w-full h-full rounded-full bg-verdigris opacity-40 animate-ping" />
                  <span className="relative inline-block w-2 h-2 rounded-full bg-verdigris drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
                </div>
                <span className="font-mono text-sm font-semibold text-white bg-white/5 px-3 py-1 rounded border border-white/10">
                  {truncate(address)}
                </span>
                <button
                  onClick={onDisconnect}
                  className="font-mono text-[10px] text-paper-dim border border-white/20 rounded-md px-3 py-1.5 hover:border-brass/50 hover:text-brass hover:bg-brass/10 transition-all duration-300 uppercase tracking-widest font-bold"
                  title="Disconnect wallet"
                >
                  disconnect
                </button>
              </div>
              <a
                href={explorerContractUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-paper-dim hover:text-verdigris transition-colors uppercase tracking-widest mt-1 font-semibold"
              >
                ↗ view contract on-chain
              </a>
            </>
          ) : (
            <button
              onClick={onConnect}
              disabled={status === "connecting"}
              id="connect-wallet-btn"
              className="group relative font-mono font-bold text-xs text-white border-none rounded-xl px-6 py-3 overflow-hidden transition-all duration-300 disabled:opacity-50 tracking-widest uppercase shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,160,0.5)] hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-verdigris via-brass to-verdigris background-animate opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-[1px] bg-graphite rounded-xl z-0"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-verdigris/20 to-brass/20 z-0"></div>
              {status === "connecting" ? (
                <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  connecting…
                </span>
              ) : (
                <span className="relative z-10 drop-shadow-md flex items-center gap-2">
                  connect wallet <span className="text-verdigris group-hover:text-white transition-colors">→</span>
                </span>
              )}
            </button>
          )}
          {(status === "unavailable" || status === "error") && error && (
            <p className="text-[11px] text-brass max-w-[260px] text-right mt-1 font-mono font-semibold">
              {error}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
