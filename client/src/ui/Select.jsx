export default function Select({ label, children, ...props }) {
  return (
    <label className="block">
      {label && <div className="text-sm font-medium text-black/70 mb-1">{label}</div>}
      <select
        className="w-full px-3 py-2 rounded-xl bg-white border border-line
                   focus:outline-none focus:ring-4 focus:ring-black/10 focus:border-black/20"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
