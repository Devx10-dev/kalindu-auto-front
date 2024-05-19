export const formatDateToISO = (inputDate: string | Date): string => {
  // Create a new Date object from the input string
  const date = new Date(inputDate);

  // Get the components of the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format the date and time to ISO 8601 format
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  return formattedDate;
};

export function convertArrayToISOFormat(doneAt: number[]): string {
  // Destructure the array into individual components
  const [year, month, day, hours, minutes, seconds, milliseconds] = doneAt;

  // Create a new Date object
  const date = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);

  // Format the date to a readable string
  // For example: "YYYY-MM-DD HH:MM:SS"
  const formattedDate = date.toISOString().replace('T', ' ').split('.')[0];
  return formattedDate;
}