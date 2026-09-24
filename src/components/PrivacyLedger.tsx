export function PrivacyLedger() {
  return (
    <div className="bg-white border-slate-200 rounded-2xl p-8 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(245,158,11,0.08)] transition-shadow duration-500">
      <div className="absolute inset-0 bg-gradient-to-bl from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <h3 className="font-display font-bold text-2xl text-slate-900 mb-6">
        What an observer can see
      </h3>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <p className="font-mono text-xs text-blue-600 uppercase tracking-widest font-bold mb-4">public</p>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2 items-start"><span className="text-blue-500">·</span> the gated resource's name</li>
            <li className="flex gap-2 items-start"><span className="text-blue-500">·</span> the minimum tier the gate requires</li>
            <li className="flex gap-2 items-start"><span className="text-blue-500">·</span> the running count of successful verifications</li>
            <li className="flex gap-2 items-start"><span className="text-blue-500">·</span> the set of spent credential nullifiers</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs text-amber-600 uppercase tracking-widest font-bold mb-4">private</p>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2 items-start"><span className="text-amber-500">·</span> the credential secret itself</li>
            <li className="flex gap-2 items-start"><span className="text-amber-500">·</span> the holder's exact tier (only "≥ required" is proved)</li>
            <li className="flex gap-2 items-start"><span className="text-amber-500">·</span> any link between a nullifier and a holder's identity</li>
            <li className="flex gap-2 items-start"><span className="text-amber-500">·</span> which credential passed at which moment</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          Each presentation proves, in zero-knowledge, that the caller
          holds a credential issued by the trusted issuer, at or above the
          required tier, and hasn't used it here before —{" "}
          <em className="not-italic text-slate-900 font-bold tracking-wide">
            without revealing which credential, or its exact tier
          </em>
          .
        </p>
      </div>
    </div>
  );
}
