export default function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs
                     bg-black/5 border border-line text-black/70">
      {children}
    </span>
  );
}
