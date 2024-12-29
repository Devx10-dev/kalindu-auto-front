import { currencyAmountString } from "@/utils/analyticsUtils";
import { useEffect, useState } from "react";

export default function CurrencyComponent({
  amount,
  currency,
  withoutCurrency,
  mainTextSize = "text-3xl", // Default size for the main text
  subTextSize = "text-sm", // Default size for the subtext
  fontStyle = "font-bold", // Default font style
}: {
  amount: number;
  currency: string | undefined;
  withoutCurrency?: boolean;
  mainTextSize?: string; // Optional prop for main text size
  subTextSize?: string; // Optional prop for subtext size
  fontStyle?: string; // Optional prop for font style
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

  return (
    <div className={`${fontStyle} ${mainTextSize}`}>
      <span>{withoutCurrency == true ? pre.replace(/[^0-9]/g, "") : pre}</span>
      <span className={`${subTextSize} color-muted-foreground`}>.{post}</span>
    </div>
  );
}
