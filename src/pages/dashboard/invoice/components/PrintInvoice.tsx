import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { InvoiceData } from "@/types/Invoices/invoiceTypes";
import * as JSPM from "jsprintmanager";
import { useEffect, useState } from "react";

function PrintInvoice({
  buttonRef,
  invoiceData,
  popupMode,
  dialogOpen,
  onDialogOpenChange,
}: {
  buttonRef: React.MutableRefObject<HTMLButtonElement | null>;
  invoiceData: InvoiceData | null;
  popupMode?: boolean;
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
}) {
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
    if (!invoiceData) {
      return toast({
        title: "No invoice data",
        description: "Please wait for the invoice to load before printing.",
        variant: "destructive",
      });
    }
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
    const TOTALS_POS_NL = 0x90; // 400 dots - totals value position (rightmost)
    const TOTALS_POS_NH = 0x01;
    const INITIAL_SKIP_LINES = 7; // Lines to skip past pre-printed header
    const PRE_ITEMS_LINES = 5; // Gap between customer details and items
    const MAX_ITEM_LINES = 30; // Max item lines for vertical alignment
    const ADDRESS_MAX_LINES = 3; // Max lines for multiline address
    const ITEM_DESC_MAX_CHARS = 30; // Max chars per line for item description

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

    // Row 2: Address (multiline - up to 3 lines, 30 char limit per line) + Date on first line
    // Split address: first by newlines, then wrap each line at 30 chars
    const ADDRESS_LINE_MAX_CHARS = 30;
    const rawAddressLines = customerAddress
      ? customerAddress.split("\n")
      : [""];
    const addressLines: string[] = [];
    for (const line of rawAddressLines) {
      if (line.length <= ADDRESS_LINE_MAX_CHARS) {
        addressLines.push(line);
      } else {
        for (let c = 0; c < line.length; c += ADDRESS_LINE_MAX_CHARS) {
          addressLines.push(line.substring(c, c + ADDRESS_LINE_MAX_CHARS));
        }
      }
      if (addressLines.length >= ADDRESS_MAX_LINES) break;
    }
    // Pad to exactly ADDRESS_MAX_LINES so rows always occupy space
    while (addressLines.length < ADDRESS_MAX_LINES) {
      addressLines.push("");
    }

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

    // Row: Customer VAT Reg. No. (always output a space to preserve row even if empty)
    cmds += leftPos + (customerVatId || " ") + newLine;

    // Row: Vehicle No. (always output a space to preserve row even if empty)
    cmds += leftPos + (vehicleNumber || " ") + newLine;

    // Row: Contact No. (always output a space to preserve row even if empty)
    cmds += leftPos + (customerContactNo || " ") + newLine;

    // Gap between customer details and items table
    cmds += newLine.repeat(PRE_ITEMS_LINES);

    // ===== Items Table =====
    // Columns: Description(30 max, wraps) | Price(12) | Discount gap(10) | Qty(12) | Value(18 - rightmost)
    // Description wrapping: if name > 30 chars, split into multiple lines.
    // Extra lines count toward total printed lines to reduce vertical alignment padding.
    let totalPrintedLines = 0;
    if (Array.isArray(invoiceData?.invoiceItems)) {
      invoiceData.invoiceItems.forEach((item) => {
        const itemName = item.name || "";
        if (itemName.length <= ITEM_DESC_MAX_CHARS) {
          // Single line item
          cmds +=
            itemName.padEnd(ITEM_DESC_MAX_CHARS) +
            printRightAlign(item.price || "", 12) +
            " ".repeat(10) +
            printRightAlign(item.quantity || "", 12) +
            printRightAlign(item.price * item.quantity || "", 18) +
            newLine;
          totalPrintedLines += 1;
        } else {
          // Multi-line: split description into chunks of ITEM_DESC_MAX_CHARS
          const descLines: string[] = [];
          for (let c = 0; c < itemName.length; c += ITEM_DESC_MAX_CHARS) {
            descLines.push(itemName.substring(c, c + ITEM_DESC_MAX_CHARS));
          }
          // First line: description chunk + price/qty/value
          cmds +=
            descLines[0].padEnd(ITEM_DESC_MAX_CHARS) +
            printRightAlign(item.price || "", 12) +
            " ".repeat(10) +
            printRightAlign(item.quantity || "", 12) +
            printRightAlign(item.price * item.quantity || "", 18) +
            newLine;
          totalPrintedLines += 1;
          // Remaining description lines: only description, no numbers
          for (let d = 1; d < descLines.length; d++) {
            cmds += descLines[d].padEnd(ITEM_DESC_MAX_CHARS) + newLine;
            totalPrintedLines += 1;
          }
        }
      });
      cmds += handleVerticalAlignment(totalPrintedLines, MAX_ITEM_LINES);
    }

    // ===== Totals Section (3 separate lines, positioned rightmost) =====
    const totalAmount = invoiceData?.totalPrice || 0;
    const vatAmount = invoiceData?.vat || 0;
    const subTotal = totalAmount - vatAmount;

    cmds += boldOn;

    // Sub Total line
    cmds += totalsPos + printRightAlign(subTotal.toFixed(2), 12) + newLine;

    // 2mm gap before VAT
    cmds += microFeed(14);

    // VAT (18%) line
    cmds += totalsPos + printRightAlign(vatAmount.toFixed(2), 12) + newLine;

    // 2 lines gap before TOTAL
    cmds += newLine.repeat(2);

    // TOTAL line
    cmds += totalsPos + printRightAlign(totalAmount.toFixed(2), 12);

    cmds += boldOff;

    // Final commands
    cmds += formFeed + cutPaper;

    cpj.printerCommands = cmds.trim();
    cpj.sendToClient();
    if (popupMode) {
      onDialogOpenChange?.(false);
    }
  };

  const inputFields = (
    <div className="space-y-3">
      {invoiceData?.vat > 0 && (
        <div className="flex items-center justify-between">
          <label className="mr-2 w-36 shrink-0">Customer VAT ID:</label>
          <Input
            type="text"
            value={customerVatId}
            onChange={(e) => setCustomerVatId(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
            placeholder="Enter Customer VAT ID"
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <label className="mr-2 w-36 shrink-0">Vehicle Number:</label>
        <Input
          type="text"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          placeholder="Enter Vehicle Number"
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="mr-2 w-36 shrink-0">Address:</label>
        <Input
          type="text"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          placeholder="Enter Customer Address"
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="mr-2 w-36 shrink-0">Contact No:</label>
        <Input
          type="text"
          value={customerContactNo}
          onChange={(e) => setCustomerContactNo(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          placeholder="Enter Contact Number"
        />
      </div>
    </div>
  );

  if (popupMode) {
    return (
      <>
        <Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Print Invoice</DialogTitle>
              <DialogDescription>
                Enter customer details to include on the printed invoice.
              </DialogDescription>
            </DialogHeader>
            {inputFields}
            <DialogFooter>
              <Button onClick={() => handlePrint()}>Print</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          style={{ display: "none" }}
          hidden
          ref={buttonRef}
          onClick={() => handlePrint()}
        />
      </>
    );
  }

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
        hidden
        ref={buttonRef}
        onClick={() => handlePrint()}
      />
    </div>
  );
}

export default PrintInvoice;
