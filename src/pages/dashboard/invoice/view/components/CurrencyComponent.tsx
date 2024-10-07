import { currencyAmountString } from "@/utils/analyticsUtils";
import { useEffect, useState } from "react";

export default function CurrencyComponent({
  amount,
  currency,
  withoutCurrency,
}: {
  amount: number;
  currency: string | undefined;
  withoutCurrency?: boolean;
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

  // const [pre, post] = amountString.split(/(?<=\..*)\./

  useEffect(() => {
    const [pre, post] = amountString.split(/(?<=\..*)\./);
    setPre(pre);
    setPost(post);
  }, [amountString]);

  return (
    <div className="text-3xl font-bold">
      <span>{withoutCurrency == true ? pre.replace(/[^0-9]/g, "") : pre}</span>
      <span className="text-sm color-muted-foreground">.{post}</span>
    </div>
  );
}
