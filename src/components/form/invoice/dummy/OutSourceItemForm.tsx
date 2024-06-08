import IconButton from "@/components/button/IconButton";
import FillCheckIcon from "@/components/icon/FillCheckIcon";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";

function OutSourceItemForm({
  outsourceItems,
  outsourceItem,
  setOutsourcedItems,
}: {
  outsourceItems: OutsourcedItem[];
  outsourceItem: OutsourcedItem;
  setOutsourcedItems: React.Dispatch<React.SetStateAction<OutsourcedItem[]>>;
}) {
  const [companyName, setCompanyName] = useState(outsourceItem.companyName);
  const [buyingPrice, setBuyingPrice] = useState(outsourceItem.buyingPrice);

  useEffect(() => {
    setCompanyName(outsourceItem.companyName);
    setBuyingPrice(outsourceItem.buyingPrice);
  }, [outsourceItem]);

  const onSave = () => {
    if (
      companyName === undefined ||
      companyName.trim().length <= 0 ||
      Number.isNaN(buyingPrice) ||
      buyingPrice <= 0
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Required details are missing",
        duration: 5000,
      });

      setCompanyName(outsourceItem.companyName);
      setBuyingPrice(outsourceItem.buyingPrice);
      return;
    }

    setOutsourcedItems((outsourceItems) =>
      outsourceItems.map((item) =>
        item.index === outsourceItem.index
          ? { ...item, buyingPrice: buyingPrice, companyName: companyName }
          : item
      )
    );
    toast({
      variant: "default",
      title: "Success",
      description: "Outsource details saved successfully",
    });
  };

  return (
    <div className="d-flex gap-1">
      <div key={outsourceItem.index} className="grid grid-cols-5 gap-4 mb-2">
        <Input type="text" value={outsourceItem.itemName} disabled />
        <Input type="text" value={outsourceItem.itemCode} disabled />
        <Input type="text" value={outsourceItem.quantity} disabled />
        <Input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Input
          type="number"
          value={buyingPrice}
          onChange={(e) => setBuyingPrice(parseFloat(e.target.value))}
        />
      </div>
      {outsourceItem.companyName !== undefined &&
      outsourceItem.companyName.length > 0 &&
      outsourceItem.buyingPrice > 0 ? (
        <IconButton
          handleOnClick={onSave}
          icon={<FillCheckIcon height="25" width="25" color="#097969" />}
          tooltipMsg="Update outsouce item details"
          variant="link"
        />
      ) : (
        <IconButton
          handleOnClick={onSave}
          icon={<CheckIcon height="25" width="25" color="#097969" />}
          tooltipMsg="Save outsouce item details"
          variant="link"
        />
      )}
    </div>
  );
}

export default OutSourceItemForm;
