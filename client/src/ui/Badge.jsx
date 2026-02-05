export default function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs
                     bg-gold-500/10 border border-gold-500/20 text-gold-200 tracking-wide">
      {children}
    </span>
  );
}
