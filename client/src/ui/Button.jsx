export default function Button({ as: As = "button", className = "", ...props }) {
  return (
    <As
      className={
        "px-4 py-2 rounded-lg font-semibold tracking-wide " +
        "text-ink-950 bg-gradient-to-r from-gold-400 to-gold-600 " +
        "hover:opacity-95 active:opacity-90 transition shadow-glow " +
        className
      }
      {...props}
    />
  );
}
