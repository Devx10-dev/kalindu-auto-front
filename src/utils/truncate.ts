export default function truncate(
  fullStr,
  strLen = 8,
  separator = "...",
  frontChars = 3,
  backChars = 6,
) {
  if (fullStr.length <= strLen) return fullStr;

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
}
