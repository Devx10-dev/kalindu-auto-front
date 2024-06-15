export default function addLeadingZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
}
