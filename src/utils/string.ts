/**
 * Capitalizes the first letter of every word in a given string.
 * @param input - The input string to capitalize.
 * @returns A new string where the first letter of each word is capitalized.
 */
export default function capitalize(value: string | undefined): string {
  if (!value) return ""; // Return an empty string if the value is undefined or null
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function toNormalCase(input: string): string {
  // Split the input string by underscores
  const words = input.split("_");

  // Capitalize the first letter of each word and make the rest lowercase
  const capitalizedWords = words.map((word) => {
    return word.charAt(0) + word.slice(1).toLowerCase();
  });

  // Join the words with spaces
  return capitalizedWords.join(" ");
}

export function truncate(
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