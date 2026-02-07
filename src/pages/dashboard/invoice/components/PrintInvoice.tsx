import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { InvoiceData } from "@/types/Invoices/invoiceTypes";
import * as JSPM from "jsprintmanager";
import { useEffect, useState } from "react";

function PrintInvoice({
  buttonRef,
  invoiceData,
}: {
  buttonRef: React.MutableRefObject<HTMLButtonElement>;
  invoiceData: InvoiceData;
}) {
  console.log(invoiceData);
  const { toast } = useToast();
  const [printToDefault, setPrintToDefault] = useState<boolean>(true);
  const [customerVatId, setCustomerVatId] = useState<string>("");
  const [vehicleNumber, setVehicleNumber] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [customerContactNo, setCustomerContactNo] = useState<string>("");

  const printRightAlign = (value: string | number, totalLength: number) => {
    const strValue = value.toString();
    return " ".repeat(Math.max(0, totalLength - strValue.length)) + strValue;
  };

  const handleVerticalAlignment = (
    existingRecordCount: number,
    totalLines: number,
  ) => {
    const newLine = "\n";
    return newLine.repeat(Math.max(0, totalLines - existingRecordCount));
  };

  useEffect(() => {
    const initializePrintManager = async () => {
      JSPM.JSPrintManager.auto_reconnect = true;
      await JSPM.JSPrintManager.start();
    };

    initializePrintManager();
  }, []);

  // Pre-fill input fields from invoiceData when available
  useEffect(() => {
    if (invoiceData?.contactNo) {
      setCustomerContactNo(invoiceData.contactNo);
    }
    if (invoiceData?.address) {
      setCustomerAddress(invoiceData.address);
    }
    if (invoiceData?.vehicle) {
      setVehicleNumber(invoiceData.vehicle);
    }
  }, [invoiceData]);

  const handlePrint = () => {
    if (!printToDefault) {
      return toast({
        title: "Printer Selection Required",
        description:
          "Please select a printer or enable default printing to proceed.",
        variant: "destructive",
      });
    }

    const cpj = new JSPM.ClientPrintJob();
    cpj.clientPrinter = printToDefault
      ? new JSPM.DefaultPrinter()
      : new JSPM.InstalledPrinter("Default");

    // ===== Adjustable Position Constants (dot units for ESC $ command) =====
    // Tune these values via test printing on the new pre-printed form
    // 1cm ≈ 24 dots at 60dpi
    const LEFT_POS_NL = 0x36; // 54 dots (~22.7mm / ~1cm more right than before)
    const LEFT_POS_NH = 0x00;
    const RIGHT_POS_NL = 0x7d; // 381 dots (~161mm) - right field value start
    const RIGHT_POS_NH = 0x01;
    const TOTALS_POS_NL = 0x40; // 320 dots - totals value position (further right)
    const TOTALS_POS_NH = 0x01;
    const INITIAL_SKIP_LINES = 7; // Lines to skip past pre-printed header
    const PRE_ITEMS_LINES = 5; // Gap between customer details and items
    const MAX_ITEM_LINES = 30; // Max item lines for vertical alignment
    const ADDRESS_MAX_LINES = 3; // Max lines for multiline address

    // Helper to build ESC $ absolute position command
    const absPos = (nL: number, nH: number) =>
      `\x1B\x24${String.fromCharCode(nL)}${String.fromCharCode(nH)}`;

    // ESC J n - advance print position vertically by n/180 inch (micro line feed)
    const microFeed = (n: number) => `\x1B\x4A${String.fromCharCode(n)}`;

    const leftPos = absPos(LEFT_POS_NL, LEFT_POS_NH);
    const rightPos = absPos(RIGHT_POS_NL, RIGHT_POS_NH);
    const totalsPos = absPos(TOTALS_POS_NL, TOTALS_POS_NH);

    const esc = "\x1B"; // ESC character
    const reset = esc + "@"; // Reset printer
    const boldOn = esc + "E"; // Bold text on
    const boldOff = esc + "F"; // Bold text off

    const newLine = "\n"; // Line break
    const formFeed = "\x0C"; // Form feed
    const cutPaper = esc + "i"; // Cut paper command

    let issuedDate = "";
    if (invoiceData?.issuedTime) {
      issuedDate = invoiceData.issuedTime.split(" ")[0];
    }

    let cmds = "";

    // Reset printer and set initial settings
    cmds += reset;

    // Skip past pre-printed header area
    cmds += newLine.repeat(INITIAL_SKIP_LINES);

    // ===== Customer Details Section =====

    // Row 1: Name + Inv. No.
    cmds +=
      leftPos +
      (invoiceData?.creditorName || "") +
      rightPos +
      " ".repeat(6) +
      (invoiceData?.invoiceId || "").slice(-10) +
      newLine;

    // 2mm gap between Name and Address (~4 dots at 60dpi ≈ 1/180*14)
    cmds += microFeed(14);

    // Row 2: Address (multiline - up to 3 lines) + Date on first line
    const addressLines = customerAddress
      ? customerAddress.split("\n").slice(0, ADDRESS_MAX_LINES)
      : [""];

    // First address line + Date
    cmds +=
      leftPos +
      (addressLines[0] || "") +
      rightPos +
      " ".repeat(6) +
      (issuedDate || "") +
      newLine;

    // Additional address lines + Sale type on second address line
    for (let i = 1; i < ADDRESS_MAX_LINES; i++) {
      if (i === 1) {
        // 2mm micro feed so Sale aligns lower on the form
        cmds += microFeed(14);
        // Second address line + Sale
        cmds +=
          leftPos +
          (addressLines[i] || "") +
          rightPos +
          " ".repeat(6) +
          (invoiceData?.type || "Credit") +
          newLine;
      } else {
        // Third address line (no right-side field)
        cmds += leftPos + (addressLines[i] || "") + newLine;
      }
    }

    // Row: Customer VAT Reg. No.
    cmds += leftPos + (customerVatId || "") + newLine;

    // Row: Vehicle No.
    cmds += leftPos + (vehicleNumber || "") + newLine;

    // Row: Contact No.
    cmds += leftPos + (customerContactNo || "") + newLine;

    // Gap between customer details and items table
    cmds += newLine.repeat(PRE_ITEMS_LINES);

    // ===== Items Table =====
    // Columns: Description(35) | Price(10) | Discount gap(8) | Qty(10) | Value(16 - rightmost)
    if (Array.isArray(invoiceData?.invoiceItems)) {
      invoiceData.invoiceItems.forEach((item) => {
        cmds +=
          (item.name || "").padEnd(35) +
          printRightAlign(item.price || "", 10) +
          " ".repeat(8) +
          printRightAlign(item.quantity || "", 10) +
          printRightAlign(item.price * item.quantity || "", 16) +
          newLine;
      });
      cmds += handleVerticalAlignment(
        invoiceData.invoiceItems.length,
        MAX_ITEM_LINES,
      );
    }

    // ===== Totals Section (3 separate lines) =====
    const totalAmount = invoiceData?.totalPrice || 0;
    const vatAmount = invoiceData?.vat || 0;
    const subTotal = totalAmount - vatAmount;

    // Sub Total line
    cmds +=
      boldOn + totalsPos + printRightAlign(subTotal.toFixed(2), 12) + newLine;

    // VAT (18%) line
    cmds += totalsPos + printRightAlign(vatAmount.toFixed(2), 12) + newLine;

    // 2 lines gap before TOTAL
    cmds += newLine.repeat(2);

    // TOTAL line
    cmds += totalsPos + printRightAlign(totalAmount.toFixed(2), 12) + boldOff;

    // Final commands
    cmds += formFeed + cutPaper;

    cpj.printerCommands = cmds.trim();
    cpj.sendToClient();
  };

  return (
    <div>
      {invoiceData?.vat > 0 && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center w-full">
            <label className="mr-2 w-full">Customer VAT ID:</label>
            <Input
              type="text"
              value={customerVatId}
              onChange={(e) => setCustomerVatId(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter Customer VAT ID"
            />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center w-full">
          <label className="mr-2 w-full">Vehicle Number:</label>
          <Input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            placeholder="Enter Vehicle Number"
          />
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center w-full">
          <label className="mr-2 w-full">Address:</label>
          <Textarea
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            placeholder="Enter Customer Address (use Enter for new lines, max 3 lines)"
            rows={3}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center w-full">
          <label className="mr-2 w-full">Contact No:</label>
          <Input
            type="text"
            value={customerContactNo}
            onChange={(e) => setCustomerContactNo(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            placeholder="Enter Contact Number"
          />
        </div>
      </div>
      <Button
        style={{ display: "none" }}
        hidden={true}
        ref={buttonRef}
        onClick={() => handlePrint()}
      />
    </div>
  );
}

export default PrintInvoice;
