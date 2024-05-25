import { Input } from "@/components/ui/input";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";

function OutSourceItemForm({
  items,
  item,
}: {
  items: OutsourcedItem[];
  item: OutsourcedItem;
}) {
  return (
    <div key={item.index} className="grid grid-cols-5 gap-4 mb-2">
      <Input type="text" value={item.itemName} disabled />
      <Input type="text" value={item.itemCode} disabled />
      <Input type="text" value={item.quantity} disabled />
      <Input
        type="text"
        value={item.companyName}
        // onChange={(e) => onCompanyNameChange(item.index, e.target.value)}
      />
      <Input
        type="number"
        value={item.buyingPrice}
        // onChange={(e) =>
        //   onBuyingPriceChange(item.index, parseFloat(e.target.value))
        // }
      />
    </div>
  );
}

export default OutSourceItemForm;
