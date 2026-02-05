export default function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-white/10 border border-white/10 text-slate-200">
      {children}
    </span>
  );
}
