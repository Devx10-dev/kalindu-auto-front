import { currencyAmountString } from "@/utils/analyticsUtils";
import { useEffect, useState } from "react";

export default function CurrencyComponent({
  amount,
  currency,
  withoutCurrency,
  mainTextSize = "text-3xl", // Default size for the main text
  subTextSize = "text-sm", // Default size for the subtext
  fontStyle = "font-bold", // Default font style
  minus = false,
}: {
  amount: number;
  currency: string | undefined;
  withoutCurrency?: boolean;
  mainTextSize?: string; // Optional prop for main text size
  subTextSize?: string; // Optional prop for subtext size
  fontStyle?: string; // Optional prop for font style
  minus?: boolean;
}) {
  const [amountString, setAmountString] = useState<string>("");
  const [pre, setPre] = useState<string>("");
  const [post, setPost] = useState<string>("");

  useEffect(() => {
    if (amount) {
      setAmountString(currencyAmountString(amount, currency));
    } else {
      setAmountString(currencyAmountString(0, currency));
    }
  }, [amount, currency]);

  useEffect(() => {
    const [pre, post] = amountString.split(/(?<=\..*)\./);
    setPre(pre);
    setPost(post);
  }, [amountString]);

  // if minus add brackets
  return (
    <div className={`${fontStyle} ${mainTextSize}`}>
      {minus && <span>(</span>}
      <span>{withoutCurrency == true ? pre.replace(/[^0-9]/g, "") : pre}</span>
      <span className={`${subTextSize} color-muted-foreground`}>.{post}</span>
      {minus && <span>)</span>}
    </div>
  );
}
