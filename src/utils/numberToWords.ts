const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertBelowThousand(value: number): string {
  if (value === 0) return "";
  if (value < 20) return ONES[value];
  if (value < 100) {
    return (
      TENS[Math.floor(value / 10)] + (value % 10 ? " " + ONES[value % 10] : "")
    );
  }
  return (
    ONES[Math.floor(value / 100)] +
    " Hundred" +
    (value % 100 ? " " + convertBelowThousand(value % 100) : "")
  );
}

export function numberToWords(value: number): string {
  const rounded = Math.round(Math.abs(value) * 100) / 100;
  const rupees = Math.floor(rounded);
  const cents = Math.round((rounded - rupees) * 100);

  if (rupees === 0 && cents === 0) return "Zero Rupees Only";

  const parts: string[] = [];
  let remainder = rupees;

  const scales: [number, string][] = [
    [1_000_000_000, "Billion"],
    [1_000_000, "Million"],
    [1_000, "Thousand"],
  ];

  for (const [scale, label] of scales) {
    if (remainder >= scale) {
      parts.push(
        convertBelowThousand(Math.floor(remainder / scale)) + " " + label,
      );
      remainder %= scale;
    }
  }
  if (remainder > 0) {
    parts.push(convertBelowThousand(remainder));
  }

  let words = parts.join(" ") + " Rupees";
  if (cents > 0) {
    words += " and " + convertBelowThousand(cents) + " Cents";
  }
  return words + " Only";
}

export default numberToWords;
