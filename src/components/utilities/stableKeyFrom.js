/* generate stable key from any value */
const stableKeyFrom = (v) => {
  const s = (v && typeof v === 'object') ? JSON.stringify(v) : String(v);
  let h1 = 7;
  let h2 = 13;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = (h1 * 31 + c) % 1000000007;
    h2 = (h2 * 37 + c) % 1000000009;
  }
  return `k${Math.floor(h1).toString(36)}${Math.floor(h2).toString(36)}`;
};

export default stableKeyFrom;
