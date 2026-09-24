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
    <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-2xl sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-blue-100 blur-xl rounded-xl group-hover:bg-blue-200 transition-all duration-300"></div>
            <svg width="40" height="40" viewBox="0 0 64 64" className="relative shrink-0 shadow-lg rounded-xl">
              <rect x="6" y="6" width="52" height="52" rx="14" className="fill-white" stroke="#e2e8f0" strokeWidth="1" />
              <rect x="6" y="6" width="52" height="52" rx="14" fill="none" stroke="url(#logo-grad)" strokeWidth="2.5" />
              <circle cx="32" cy="32" r="14" fill="none" stroke="#f59e0b" strokeWidth="3" />
              <circle cx="32" cy="32" r="5" fill="#2563eb" className="animate-pulse" />
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <p className="font-display font-black text-2xl text-slate-900 tracking-widest leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-slate-800">CREDSIGNET</p>
            <p className="font-mono text-[10px] text-blue-600 uppercase tracking-widest mt-1.5 opacity-90 font-semibold">
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
                  <span className="font-mono text-[10px] bg-blue-50 text-blue-700 px-3 py-1 rounded-md border border-blue-200 font-bold tracking-widest uppercase shadow-sm">
                    {walletName}
                  </span>
                )}
                {/* Green dot indicator */}
                <div className="relative flex items-center justify-center w-4 h-4">
                  <span className="absolute inline-block w-full h-full rounded-full bg-blue-500 opacity-20 animate-ping" />
                  <span className="relative inline-block w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(37,99,235,0.4)]" />
                </div>
                <span className="font-mono text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1 rounded-md border border-slate-200 shadow-sm">
                  {truncate(address)}
                </span>
                <button
                  onClick={onDisconnect}
                  className="font-mono text-[10px] text-slate-500 border border-slate-200 rounded-md px-3 py-1.5 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all duration-300 uppercase tracking-widest font-bold bg-white"
                  title="Disconnect wallet"
                >
                  disconnect
                </button>
              </div>
              <a
                href={explorerContractUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest mt-1 font-semibold"
              >
                ↗ view contract on-chain
              </a>
            </>
          ) : (
            <button
              onClick={onConnect}
              disabled={status === "connecting"}
              id="connect-wallet-btn"
              className="group relative font-mono font-bold text-xs text-white border-none rounded-xl px-6 py-3 overflow-hidden transition-all duration-300 disabled:opacity-50 tracking-widest uppercase shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 background-animate opacity-90 group-hover:opacity-100 transition-opacity"></div>
              {status === "connecting" ? (
                <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  connecting…
                </span>
              ) : (
                <span className="relative z-10 drop-shadow-md flex items-center gap-2">
                  connect wallet <span className="text-blue-200 group-hover:text-white transition-colors">→</span>
                </span>
              )}
            </button>
          )}
          {(status === "unavailable" || status === "error") && error && (
            <p className="text-[11px] text-red-500 max-w-[260px] text-right mt-1 font-mono font-semibold">
              {error}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
