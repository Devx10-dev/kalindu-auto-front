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
