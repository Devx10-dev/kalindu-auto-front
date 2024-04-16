export default function truncate(
  text: string,
  maxLength: number,
  truncIndicator = "..."
) {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.slice(0, maxLength - truncIndicator.length) + truncIndicator;
  }
}
