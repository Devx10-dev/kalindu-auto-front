export default function PriceComponent({
  content,
  contentType = "currencyAmount",
  bold = true,
}: {
  content: string;
  contentType: string;
  bold?: boolean;
}) {
  // split from firdst dot from the right
  switch (contentType) {
    case "currencyAmount": {
      // this comes as strig "Rs. 180,666.00" i want to render the decimal part in a smaller font size
      const [currency, amount] = content.split(/(?<=\..*)\./);
      return (
        <div className={`text-md ${bold ? "font-bold" : "font-normal"}`}>
          {/* remove Rs. from begininh */}
          <span>{currency.slice(4)}</span>
          <span
            className={`text-xs color-muted-foreground ${bold ? "font-bold" : "font-normal"}`}
          >
            .{amount}
          </span>
        </div>
      );
    }
    default:
      return <div className="text-2xl font-bold">{content}</div>;
  }
}
