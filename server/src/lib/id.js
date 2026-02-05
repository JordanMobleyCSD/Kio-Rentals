export function uid(prefix = "") {
  // simple unique id (good enough for demo)
  const s = Math.random().toString(16).slice(2) + Date.now().toString(16);
  return prefix ? `${prefix}_${s}` : s;
}
