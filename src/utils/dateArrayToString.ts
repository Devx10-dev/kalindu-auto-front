import addLeadingZero from "./addLeadingZero";

export default function dateArrayToString(dateArray: number[]): string {
  let dateStr = "";

  if (
    dateArray[3] !== undefined &&
    dateArray[4] !== undefined &&
    dateArray[5] !== undefined
  ) {
    dateStr = `${dateArray[0]}-${dateArray[1]}-${dateArray[2]} ${addLeadingZero(dateArray[3])}:${addLeadingZero(dateArray[4])}:${addLeadingZero(dateArray[5])}`;
  } else {
    dateStr = `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
  }

  return dateStr;
}
