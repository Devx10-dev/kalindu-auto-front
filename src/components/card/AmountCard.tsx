import CurrencyComponent from "@/pages/dashboard/invoice/view/components/CurrencyComponent";
import React from "react";

function AmountCard({ amount, color, fontStyle = "font-bold",withoutCurrency = true }: { amount: number; color: string; fontStyle?: string; withoutCurrency? : boolean }) {
  return (
    <p
      style={{
        background: color,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        width: "max-content",
      }}
    >
      {/* {amount} */}
      <CurrencyComponent
        amount={amount ? parseFloat(amount.toFixed(2)) : 0}
        currency="Rs"
        withoutCurrency = {withoutCurrency}
        mainTextSize="text-md"
        subTextSize="text-xs"
        fontStyle={fontStyle}
      />
    </p>
  );
}

export default AmountCard;
