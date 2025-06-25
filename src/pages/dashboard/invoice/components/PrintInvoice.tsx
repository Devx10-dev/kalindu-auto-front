import { Button } from "@/components/ui/button";
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

  const printRightAlign = (value: string | number, totalLength: number) => {
    const strValue = value.toString();
    return " ".repeat(Math.max(0, totalLength - strValue.length)) + strValue;
  };

  const printLeftAlign = (value: string | number, totalLength: number) => {
    const strValue = value.toString();
    return strValue + " ".repeat(Math.max(0, totalLength - strValue.length));
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
      : new JSPM.InstalledPrinter(printToDefault);

    const esc = "\x1B"; // ESC character
    const reset = esc + "@"; // Reset printer
    const boldOn = esc + "E"; // Bold text on
    const boldOff = esc + "F"; // Bold text off
    const underlineOn = esc + "-1"; // Underline on
    const underlineOff = esc + "-0"; // Underline off
    const alignCenter = esc + "a1"; // Center alignment
    const alignLeft = esc + "a0"; // Left alignment
    const alignRight = esc + "a2"; // Right alignment
    const condensedOn = esc + "\x0F"; // Condensed printing ON
    const condensedOff = esc + "\x12"; // Condensed printing OFF
    const doubleWidthOn = esc + "W1"; // Double width ON
    const doubleWidthOff = esc + "W0"; // Double width OFF

    const newLine = "\n"; // Line break
    const formFeed = "\x0C"; // Form feed
    const cutPaper = esc + "i"; // Cut paper command

    let cmds = "";

    // Reset printer and set initial settings
    cmds += reset + alignLeft;

    // Company Header - Center aligned
    cmds += alignCenter + boldOn;
    cmds += "KALINDU AUTO (PVT) LTD." + newLine;
    cmds += boldOff;
    cmds += "Importers of Automobiles, Machinery & Body Parts" + newLine;
    cmds += "No.260/1, Kandy Road, Yakkala." + newLine;
    cmds += newLine;

    // Contact info - right aligned
    cmds += alignRight;
    cmds += "Tel: 033-2234900" + newLine;
    cmds += "Fax: 033-2234959" + newLine;
    cmds += "Email: kalindua979@gmail.com" + newLine;
    cmds += newLine;

    // Tax Invoice header - Center aligned
    cmds += alignCenter + boldOn;
    cmds += "TAX INVOICE" + newLine;
    cmds += boldOff;
    cmds += alignRight;
    cmds += "VAT NO.: 114501433-7000" + newLine;
    cmds += newLine;

    // Customer and Invoice details section
    cmds += alignLeft;

    // First row: Name and Inv. No.
    cmds +=
      printLeftAlign("Name", 12) +
      printLeftAlign(invoiceData?.creditorName || "", 40) +
      printRightAlign("Inv. No.", 15) +
      printRightAlign((invoiceData?.invoiceId || "").slice(-10), 15) +
      newLine;

    // Second row: Customer VAT and Date
    cmds +=
      printLeftAlign("Customer", 12) +
      printLeftAlign(invoiceData?.contactNo || "", 40) +
      printRightAlign("Date", 15) +
      printRightAlign(invoiceData?.issuedTime || "", 15) +
      newLine;

    // Third row: Vehicle and Sale type
    cmds +=
      printLeftAlign("Vehicle", 12) +
      printLeftAlign(invoiceData?.vehicle || "", 40) +
      printRightAlign("Sale", 15) +
      printRightAlign(invoiceData?.type || "CREDIT", 15) +
      newLine;

    cmds += newLine;

    // Table header with underline
    cmds += underlineOn;
    cmds +=
      printLeftAlign("Item", 35) +
      printLeftAlign("Description", 25) +
      printRightAlign("Rate", 8) +
      printRightAlign("Qty", 6) +
      printRightAlign("Price", 10) +
      newLine;
    cmds += underlineOff;

    // Table Content
    if (Array.isArray(invoiceData?.invoiceItems)) {
      invoiceData.invoiceItems.forEach((item) => {
        cmds +=
          printLeftAlign(item.name || "", 35) +
          printLeftAlign("", 25) + // Description column (empty in your data)
          printRightAlign(item.price || "", 8) +
          printRightAlign(item.quantity || "", 6) +
          printRightAlign(item.price * item.quantity || "", 10) +
          newLine;
      });

      // VAT line
      if (invoiceData?.vat != null) {
        cmds += newLine;
        cmds +=
          printLeftAlign("VAT [ID: 114501433-7000]", 60) +
          printRightAlign(invoiceData?.vat || "", 20) +
          newLine;
      }

      // Add spacing for consistent layout
      cmds += handleVerticalAlignment(invoiceData.invoiceItems.length + 2, 15);
    }

    // Totals section - right aligned
    cmds += newLine;
    if (invoiceData?.totalDiscount) {
      cmds += alignRight;
      cmds += "Discount: " + (invoiceData?.totalDiscount || "") + newLine;
    }

    cmds += alignRight + boldOn;
    cmds += "Total: " + (invoiceData?.totalPrice || "") + newLine;
    cmds += boldOff;

    cmds += newLine.repeat(3);

    // Footer section
    cmds += alignLeft;
    cmds +=
      printLeftAlign("Prepared by:", 25) +
      printLeftAlign("Approved by:", 25) +
      printLeftAlign("Customer:", 25) +
      newLine;

    cmds += newLine.repeat(3);
    cmds += alignRight;
    cmds += "RECEIVED THE ITEMS IN GOOD CONDITION" + newLine;

    // Final commands
    cmds += formFeed + cutPaper;

    cpj.printerCommands = cmds.trim();
    cpj.sendToClient();
  };

  return (
    <Button
      style={{ display: "none" }}
      hidden={true}
      ref={buttonRef}
      onClick={() => handlePrint()}
    />
  );
}

export default PrintInvoice;
