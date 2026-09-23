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
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-verdigris/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-brass/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" style={{animationDelay: "2s"}}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-verdigris-light/10 rounded-full mix-blend-screen filter blur-[150px] animate-blob" style={{animationDelay: "4s"}}></div>
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

      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-12 z-10">
        <section className="mb-12 text-center flex flex-col items-center">
          <div className="inline-block glass-panel rounded-full px-5 py-2 mb-8 border-verdigris/30">
             <p className="font-mono text-xs text-verdigris-light font-bold tracking-widest uppercase">
               Next-Gen ZK Verification
             </p>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white leading-tight max-w-3xl mb-6">
            Prove who vouches for you, <br/><span className="neon-text">without showing them the paper.</span>
          </h1>
          <p className="text-paper-dim text-lg mt-4 max-w-2xl leading-relaxed">
            Present a credential below. The gate checks it was genuinely issued
            and meets the required tier — and records only that a valid credential
            passed, never which one, or exactly how qualified it was.
          </p>
          <a
            href={explorerContractUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm text-verdigris hover:text-white transition-all mt-10 glass-panel px-6 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] border-verdigris/20"
          >
            ↗ View Contract on Midnight Preprod Explorer
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
