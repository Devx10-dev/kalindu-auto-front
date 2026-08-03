import PageHeader from "@/components/card/PageHeader";
import { useNavigate } from "react-router-dom";
import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
import ReceiptIcon from "@/components/icon/ReceiptIcon";
import GridModal from "@/components/modal/GridModal";
import DummyInvoiceItemsGrid from "@/components/table/invoice/dummy/DummyInvoiceItemsGrid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { toast } from "@/components/ui/use-toast";
import QuotationInvoiceView from "./QuotationInvoiceView ";

export interface Customer {
  name: string;
  contactNo?: string;
  address?: string;
}

export interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

function DummyInvoice() {
  const [show, setShow] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const navigate = useNavigate();

  const inputRefs = useRef<any[]>([]);
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const description =
    "A quotation is an estimate provided to a customer, detailing the expected costs of goods or services before a transaction. " +
    "It serves as a formal price offer but is not the final bill.";

  // const handlePrintBtn = () => {
  //   let err = null;

  //   if (customer === null) {
  //     err = "Please enter customer details";
  //   } else if (customer.name.length === 0) {
  //     err = "Please enter customer name";
  //   }

  //   if (items.length === 0) {
  //     err = "Please add at least one item";
  //   }

  //   if (err !== null) {
  //     toast({
  //       variant: "destructive",
  //       title: "Validation Error",
  //       description: err,
  //     });

  //     return;
  //   }

  //   setShow(true);
  // };

  const handlePrintBtn = () => {
    let err = null;

    if (customer === null) {
      err = "Please enter customer details";
    } else if (customer.name.length === 0) {
      err = "Please enter customer name";
    }

    if (items.length === 0) {
      err = "Please add at least one item";
    }

    if (err !== null) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: err,
      });

      return;
    }

    navigate("/dashboard/invoice/quotation/print-page", {
      state: { items: items, customer: customer },
    });
  };

  return (
    <Fragment>
      <div className="ml-2">
        <CardHeader className="mb-6">
          <PageHeader
            title="Quotation"
            description={description}
            icon={<ReceiptIcon height="30" width="28" color="#162a3b" />}
          />
        </CardHeader>
        {/* Responsive container */}
        <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Item list takes 8 columns on large screens */}
          <div className="lg:col-span-8">
            <CardTitle className="mb-6">Item List</CardTitle>
            <DummyInvoiceItemsGrid items={items} setItems={setItems} />
          </div>
          {/* Customer details take 4 columns on large screens */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
                <CardDescription>
                  Details of the customer requesting the quotation, including
                  relevant contact information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="grid">
                    <RequiredLabel label="Customer Name" />
                    <Input
                      type="text"
                      value={customer?.name ?? undefined}
                      ref={(el) => (inputRefs.current[1] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 1)}
                      onChange={(e) =>
                        setCustomer({ ...customer, name: e.target.value })
                      }
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="grid">
                    <OptionalLabel label="Contact No" />
                    <Input
                      type="text"
                      value={
                        customer !== null ? customer?.contactNo : undefined
                      }
                      ref={(el) => (inputRefs.current[2] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 2)}
                      onChange={(e) =>
                        setCustomer({ ...customer, contactNo: e.target.value })
                      }
                      placeholder="Enter contact no"
                    />
                  </div>
                  <div className="grid m-0 p-0">
                    <OptionalLabel label="Address" />
                    <Textarea
                      className="max-h-32"
                      ref={(el) => (inputRefs.current[3] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 3)}
                      placeholder="Enter address"
                      value={customer !== null ? customer?.address : undefined}
                      onChange={(e) =>
                        setCustomer({ ...customer, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex mt-4">
                  <Button
                    ref={(el) => (inputRefs.current[4] = el)}
                    onClick={handlePrintBtn}
                  >
                    View Quotation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </div>
    </Fragment>
  );
}

export default DummyInvoice;
