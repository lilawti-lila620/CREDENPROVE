import { GateState } from "./CredentialCard";

export function VerificationLedger({ gate }: { gate: GateState }) {
  return (
    <div className="glass-panel border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] transition-shadow duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-verdigris/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="flex items-baseline justify-between mb-8">
        <h3 className="font-display font-bold text-2xl text-white">Verification Ledger</h3>
        <span className="font-mono text-[10px] text-verdigris uppercase tracking-widest border border-verdigris/20 px-2 py-1 rounded bg-verdigris/10">
          live · on-chain
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="font-mono text-4xl text-white font-bold drop-shadow-[0_0_8px_rgba(0,243,255,0.6)]">
            {gate.verifiedCount}
          </p>
          <p className="text-xs text-paper-dim mt-2 font-medium">credentials verified</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="font-mono text-4xl text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            {gate.requiredTier}+
          </p>
          <p className="text-xs text-paper-dim mt-2 font-medium">minimum tier required</p>
        </div>
      </div>

      <p className="font-mono text-xs text-paper-dim mt-8 pt-6 border-t border-white/10 flex justify-between uppercase tracking-wider font-semibold">
        <span>{gate.usedNullifiers.size} nullifier{gate.usedNullifiers.size === 1 ? "" : "s"}</span>
        <span className="text-verdigris">gate is {gate.gateOpen ? "open" : "closed"}</span>
      </p>
    </div>
  );
}
