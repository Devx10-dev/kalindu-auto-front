/**
 * Capitalizes the first letter of every word in a given string.
 * @param input - The input string to capitalize.
 * @returns A new string where the first letter of each word is capitalized.
 */
export default function capitalize(value: string | undefined): string {
  if (!value) return ""; // Return an empty string if the value is undefined or null
  return value.charAt(0).toUpperCase() + value.slice(1);
}
