export default function dateToString(date: Date): string {
  const padZero = (num) => (num < 10 ? "0" + num : num);

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1); // Months are zero-indexed in JavaScript
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatDateToHumanReadable(date: Date): string {
  if (!(date instanceof Date)) {
    throw new Error("Input must be a Date object");
  }

  // Define options for date formatting
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // e.g., "Monday"
    year: "numeric", // e.g., "2024"
    month: "long", // e.g., "August"
    day: "numeric", // e.g., "5"
  };

  // Format the date
  return date.toLocaleDateString("en-IN", options);
}
