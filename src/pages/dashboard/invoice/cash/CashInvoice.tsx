import InvoiceTable from "./components/InvoiceTable";
import AddItem from "./components/AddItem";
import BillSummary from "./components/BillSummary";
import OutsourcedItemDetails from "./components/OutSourcedItemDetails";
import useCashInvoiceStore from "./context/useCashInvoiceStore";
import CustomerDetails from "@/pages/dashboard/invoice/cash/components/CustomerDetails.tsx";
import Commissions from "@/pages/dashboard/invoice/cash/components/Commisions.tsx";
import {CardContent, CardHeader} from "@/components/ui/card.tsx";
import PageHeader from "@/components/card/PageHeader.tsx";
import React from "react";

import ReceiptIcon from "@/components/icon/ReceiptIcon";

const CashInvoiceBase: React.FC = () => {
  // const axiosPrivate = useAxiosPrivate();
  const { getOutsourcedItems } = useCashInvoiceStore();
  const hasOutsourcedItems = getOutsourcedItems().length > 0;

  return (
    <div className="mb-20">
        <CardHeader>
            <PageHeader
                title="Cash Invoice"
                description=""
                icon={<ReceiptIcon height="30" width="28" color="#162a3b" />}
            />
        </CardHeader>
        <CardContent
            style={{
                display: "flex",
                gap: "10px",
            }}>

            <div
                style={{
                    flex: 9
                }}
            >
                <CustomerDetails/>
                <AddItem/>
                <InvoiceTable/>
                <Commissions/>
                {hasOutsourcedItems && (
                    <div className="pb-[350px]">
                        <OutsourcedItemDetails/>
                    </div>
                )}
            </div>

            <div style={{
                flex: 3
            }}>
                <BillSummary />
            </div>
        </CardContent>

    </div>
  );
};

export default CashInvoiceBase;
