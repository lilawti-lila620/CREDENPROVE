import { useState } from "react";
import { Header } from "./components/Header";
import { CredentialCard } from "./components/CredentialCard";
import { VerificationLedger } from "./components/VerificationLedger";
import { PrivacyLedger } from "./components/PrivacyLedger";
import { useLaceWallet, WalletId } from "./hooks/useLaceWallet";
import { WalletConnectModal } from "./components/WalletConnectModal";
import { explorerContractUrl } from "./lib/onchain";

const RESOURCE_NAME = "Verified Builders Channel";
const REQUIRED_TIER = 3;

function App() {
  const wallet = useLaceWallet();
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [usedNullifiers, setUsedNullifiers] = useState<Set<string>>(new Set());
  const [, forceRender] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const gateState = {
    resourceName: RESOURCE_NAME,
    requiredTier: REQUIRED_TIER,
    verifiedCount,
    usedNullifiers,
    gateOpen: true,
  };

  function handleConnectRequest() {
    wallet.refreshAvailableWallets();
    setShowModal(true);
  }

  async function handleSelectWallet(walletId: WalletId) {
    setShowModal(false);
    await wallet.connect(walletId);
  }

  return (
    <div className="min-h-screen bg-graphite flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-verdigris/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40rem] h-[40rem] bg-brass/10 rounded-full mix-blend-screen filter blur-[140px] animate-blob" style={{animationDelay: "2s"}}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60rem] h-[60rem] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[160px] animate-blob" style={{animationDelay: "4s"}}></div>
      </div>

      {/* Wallet Connect Modal */}
      {showModal && (
        <WalletConnectModal
          wallets={wallet.availableWallets}
          onSelectWallet={handleSelectWallet}
          onCancel={() => setShowModal(false)}
        />
      )}

      <Header
        status={wallet.status}
        address={wallet.address}
        walletName={wallet.connectedWalletName}
        error={wallet.error}
        onConnect={handleConnectRequest}
        onDisconnect={wallet.disconnect}
      />

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-20 z-10 relative">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-2xl float-anim -z-10"></div>
        <div className="absolute bottom-40 right-10 w-48 h-48 bg-gradient-to-br from-amber-100 to-transparent rounded-full blur-3xl float-anim-delay -z-10"></div>

        <section className="mb-24 text-center flex flex-col items-center relative">
          <div className="relative inline-block mb-10 group cursor-default float-anim">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-indigo-300 to-amber-300 rounded-full blur opacity-50 group-hover:opacity-80 transition duration-1000"></div>
            <div className="relative glass-panel rounded-full px-8 py-3 bg-white">
               <p className="font-mono text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-3 text-slate-800">
                 <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse"></span>
                 Next-Gen ZK Verification
                 <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse"></span>
               </p>
            </div>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] max-w-5xl mb-6 tracking-tight">
            Prove <span className="italic font-light text-blue-600">who</span> vouches for you.
          </h1>
          
          <h2 className="font-display text-4xl sm:text-6xl font-bold max-w-4xl mb-10 text-slate-800">
            <span className="neon-text inline-block transform hover:scale-105 transition-transform duration-500">Without showing them the paper.</span>
          </h2>

          <p className="text-slate-600 text-xl sm:text-2xl mt-4 max-w-3xl leading-relaxed font-light bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 shadow-lg">
            Present a credential below. The gate checks it was genuinely issued
            and meets the required tier — recording <strong className="text-slate-900 font-semibold">only</strong> that a valid credential
            passed, never which one.
          </p>

          <a
            href={explorerContractUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-4 font-mono text-lg text-slate-900 mt-16 px-10 py-5 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-[0_8px_30px_rgba(37,99,235,0.15)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.2)] bg-white border border-slate-200"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
            <span className="relative z-10 font-bold tracking-wider group-hover:text-blue-700 transition-colors">↗ View Contract on Midnight Explorer</span>
          </a>
        </section>

        <section className="mb-20 relative max-w-4xl mx-auto float-anim-delay">
          <div className="absolute inset-0 neon-border rounded-[2rem] opacity-40 blur-md pointer-events-none"></div>
          <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative z-10">
            <CredentialCard
              gate={gateState}
              onVerified={(nullifier) => {
                setVerifiedCount(c => c + 1);
                if (nullifier) {
                  setUsedNullifiers(prev => {
                    const next = new Set(prev);
                    next.add(nullifier);
                    return next;
                  });
                }
                forceRender((n) => n + 1);
              }}
              walletApi={wallet.api}
              walletStatus={wallet.status}
            />
          </div>
        </section>

        <section className="grid gap-8 sm:grid-cols-2 max-w-5xl mx-auto">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-xl">
             <VerificationLedger gate={gateState} />
          </div>
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-xl">
             <PrivacyLedger />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 glass-panel mt-auto z-10">
        <div className="mx-auto max-w-4xl px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="font-mono text-xs text-paper-dim uppercase tracking-widest">
            built on midnight · compact contracts
          </p>
          <p className="font-mono text-xs text-paper-dim uppercase tracking-widest">
            level 3 · first quarter submission
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
