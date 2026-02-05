export default function Input({ label, hint, ...props }) {
  return (
    <label className="block">
      {label && <div className="text-sm font-medium text-slate-200 mb-1">{label}</div>}
      <input
        className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
        {...props}
      />
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </label>
  );
}
