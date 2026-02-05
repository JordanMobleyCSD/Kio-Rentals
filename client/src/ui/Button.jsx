export default function Button({ as: As = "button", className = "", variant = "primary", ...props }) {
  const styles =
    variant === "ghost"
      ? "bg-black/5 hover:bg-black/10 text-ink border border-line"
      : "bg-accent hover:opacity-90 text-white border border-transparent";

  return (
    <As
      className={
        "px-4 py-2 rounded-full font-semibold text-sm transition " + styles + " " + className
      }
      {...props}
    />
  );
}

