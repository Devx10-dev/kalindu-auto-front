import InvoiceTable from "./components/InvoiceTable";
import AddItem from "./components/AddItem";
import CustomerDetails from "./components/CustomerDetails";
import BillSummary from "./components/BillSummary";
import useInvoiceStore from "./context/Store";
import { useState } from "react";
import OutsourcedItemDetails from "./components/OutSourcedItemDetails";


interface OutsourcedItem {
  index: number;
  itemName: string;
  itemCode: string;
  quantity: number;
  companyName: string;
  buyingPrice: number;
}

const CashInvoice: React.FC = () => {
  const { items } = useInvoiceStore();
  const total = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const [outsourcedItems, setOutsourcedItems] = useState<OutsourcedItem[]>([]);

  const handleToggleOutsourced = (index: number) => {
    const outsourcedItem = outsourcedItems.find((item) => item.index === index);
    if (outsourcedItem) {
      setOutsourcedItems(outsourcedItems.filter((item) => item.index !== index));
    } else {
      setOutsourcedItems([
        ...outsourcedItems,
        {
          index,
          itemName: items[index].name,
          itemCode: items[index].code,
          quantity: items[index].quantity,
          companyName: '',
          buyingPrice: 0,
        },
      ]);
    }
  };

  const handleCompanyNameChange = (index: number, value: string) => {
    setOutsourcedItems(
      outsourcedItems.map((item) =>
        item.index === index ? { ...item, companyName: value } : item
      )
    );
  };

  const handleBuyingPriceChange = (index: number, value: number) => {
    setOutsourcedItems(
      outsourcedItems.map((item) =>
        item.index === index ? { ...item, buyingPrice: value } : item
      )
    );
  };

  return (
    <div className="mb-20">
      <CustomerDetails />
      <AddItem />
      <InvoiceTable handleToggleOutsourced={handleToggleOutsourced} />
      <BillSummary />
      <OutsourcedItemDetails
        outsourcedItems={outsourcedItems}
        onCompanyNameChange={handleCompanyNameChange}
        onBuyingPriceChange={handleBuyingPriceChange}
      />
      
    </div>
  );
};

export default CashInvoice;