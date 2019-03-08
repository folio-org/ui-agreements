// Insert the 4 hyphens into uuid if there is no hypen.
// Otherwise return uuid unchanged.
export default function hyphenateUuid(uuid) {
  if (uuid.includes('-')) {
    return uuid;
  }
  return uuid.slice(0, 8)
    + '-' + uuid.slice(8, 12)
    + '-' + uuid.slice(12, 16)
    + '-' + uuid.slice(16, 20)
    + '-' + uuid.slice(20, 32);
}
