export default function Card({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl border border-white/10 bg-white/[0.04] " +
        "shadow-luxe " +
        className
      }
    >
      {children}
    </div>
  );
}
