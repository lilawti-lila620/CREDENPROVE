export function PrivacyLedger() {
  return (
    <div className="glass-panel border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(255,0,160,0.15)] transition-shadow duration-500">
      <div className="absolute inset-0 bg-gradient-to-bl from-brass/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <h3 className="font-display font-bold text-2xl text-white mb-6">
        What an observer can see
      </h3>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <p className="font-mono text-xs text-verdigris uppercase tracking-widest font-bold mb-4 drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">public</p>
          <ul className="space-y-3 text-sm text-paper-dim">
            <li className="flex gap-2 items-start"><span className="text-verdigris">·</span> the gated resource's name</li>
            <li className="flex gap-2 items-start"><span className="text-verdigris">·</span> the minimum tier the gate requires</li>
            <li className="flex gap-2 items-start"><span className="text-verdigris">·</span> the running count of successful verifications</li>
            <li className="flex gap-2 items-start"><span className="text-verdigris">·</span> the set of spent credential nullifiers</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs text-brass uppercase tracking-widest font-bold mb-4 drop-shadow-[0_0_5px_rgba(255,0,160,0.5)]">private</p>
          <ul className="space-y-3 text-sm text-paper-dim">
            <li className="flex gap-2 items-start"><span className="text-brass">·</span> the credential secret itself</li>
            <li className="flex gap-2 items-start"><span className="text-brass">·</span> the holder's exact tier (only "≥ required" is proved)</li>
            <li className="flex gap-2 items-start"><span className="text-brass">·</span> any link between a nullifier and a holder's identity</li>
            <li className="flex gap-2 items-start"><span className="text-brass">·</span> which credential passed at which moment</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-sm text-paper-dim leading-relaxed font-medium">
          Each presentation proves, in zero-knowledge, that the caller
          holds a credential issued by the trusted issuer, at or above the
          required tier, and hasn't used it here before —{" "}
          <em className="not-italic text-white font-bold tracking-wide">
            without revealing which credential, or its exact tier
          </em>
          .
        </p>
      </div>
    </div>
  );
}
