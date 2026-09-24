import { GateState } from "./CredentialCard";

export function VerificationLedger({ gate }: { gate: GateState }) {
  return (
    <div className="bg-white border-slate-200 rounded-2xl p-8 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-shadow duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="flex items-baseline justify-between mb-8">
        <h3 className="font-display font-bold text-2xl text-slate-900">Verification Ledger</h3>
        <span className="font-mono text-[10px] text-blue-600 uppercase tracking-widest border border-blue-200 px-2 py-1 rounded bg-blue-50">
          live · on-chain
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="font-mono text-4xl text-blue-600 font-bold">
            {gate.verifiedCount}
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">credentials verified</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="font-mono text-4xl text-amber-500 font-bold">
            {gate.requiredTier}+
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">minimum tier required</p>
        </div>
      </div>

      <p className="font-mono text-xs text-slate-500 mt-8 pt-6 border-t border-slate-200 flex justify-between uppercase tracking-wider font-semibold">
        <span>{gate.usedNullifiers.size} nullifier{gate.usedNullifiers.size === 1 ? "" : "s"}</span>
        <span className="text-blue-600">gate is {gate.gateOpen ? "open" : "closed"}</span>
      </p>
    </div>
  );
}
