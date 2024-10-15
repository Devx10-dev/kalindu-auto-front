import React from "react";

function AmountCard({ amount, color }: { amount: number; color: string }) {
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
      {amount}
    </p>
  );
}

export default AmountCard;
