export function money(n) {
  return `$${Number(n).toLocaleString()}`;
}

export function isoDate(d) {
  try { return new Date(d).toISOString().slice(0, 10); } catch { return ""; }
}
