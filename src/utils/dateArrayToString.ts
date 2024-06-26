import addLeadingZero from "./addLeadingZero";

export default function dateArrayToString(dateArray: number[]): string {
  return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]} ${addLeadingZero(dateArray[3])}:${addLeadingZero(dateArray[4])}:${addLeadingZero(dateArray[5])}`;
}
