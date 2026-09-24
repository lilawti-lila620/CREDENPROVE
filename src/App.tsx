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

      <main className="flex-1 mx-auto max-w-5xl w-full px-6 py-16 z-10">
        <section className="mb-16 text-center flex flex-col items-center">
          <div className="inline-block glass-panel rounded-full px-6 py-2 mb-8 border-verdigris/40 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
             <p className="font-mono text-sm text-verdigris-light font-bold tracking-widest uppercase flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-verdigris animate-pulse"></span>
               Next-Gen ZK Verification
             </p>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-extrabold text-white leading-tight max-w-4xl mb-8 drop-shadow-lg">
            Prove who vouches for you, <br/>
            <span className="neon-text inline-block mt-2">without showing them the paper.</span>
          </h1>
          <p className="text-paper-dim text-xl mt-2 max-w-3xl leading-relaxed font-light">
            Present a credential below. The gate checks it was genuinely issued
            and meets the required tier — and records only that a valid credential
            passed, never which one, or exactly how qualified it was.
          </p>
          <a
            href={explorerContractUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 font-mono text-base text-white mt-12 glass-panel px-8 py-4 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-verdigris/20 to-brass/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 font-bold group-hover:text-verdigris transition-colors">↗ View Contract on Midnight Explorer</span>
          </a>
        </section>

        <section className="mb-14 relative">
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
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <VerificationLedger gate={gateState} />
          <PrivacyLedger />
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
