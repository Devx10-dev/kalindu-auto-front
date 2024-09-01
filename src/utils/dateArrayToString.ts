import addLeadingZero from "./addLeadingZero";

export default function dateArrayToString(
  dateArray: number[],
  withoutTime?: boolean,
): string {
  let dateStr = "";
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (
    dateArray[3] !== undefined &&
    dateArray[4] !== undefined &&
    dateArray[5] !== undefined &&
    !withoutTime
  ) {
    dateStr = `${dateArray[0]}-${dateArray[1]}-${dateArray[2]} ${addLeadingZero(dateArray[3])}:${addLeadingZero(dateArray[4])}:${addLeadingZero(dateArray[5])}`;
  } else {
    // dateStr = `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
    // FORMAT: DAY [Month with 3 letters] YEAR
    dateStr = `${dateArray[2]} ${months[dateArray[1] - 1].substring(0, 3)} ${dateArray[0]}`;
  }

  return dateStr;
}
