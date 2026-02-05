export default function Button({ as: As = "button", className = "", ...props }) {
  return (
    <As
      className={
        "px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 " +
        "hover:opacity-95 active:opacity-90 transition " + className
      }
      {...props}
    />
  );
}
