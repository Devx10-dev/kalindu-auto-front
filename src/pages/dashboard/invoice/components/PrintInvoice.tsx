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

    let cpj = new JSPM.ClientPrintJob();
    cpj.clientPrinter = printToDefault
      ? new JSPM.DefaultPrinter()
      : new JSPM.InstalledPrinter(printToDefault);

    const esc = "\x1B"; // ESC character
    const reset = esc + "@"; // Reset printer
    const boldOn = esc + "E"; // Bold text on
    const boldOff = esc + "F"; // Bold text off
    // Set print area width to 250mm
    const rightMargin = "\x1B\x51\x64"; // 255mm
    const underlineOn = esc + "-1"; // Underline on
    const underlineOff = esc + "-0"; // Underline off
    const alignCenter = esc + "a1"; // Center alignment
    const alignLeft = esc + "a0"; // Left alignment
    const alignRight = esc + "a2"; // Right alignment
    const condensedOn = esc + "\x0F"; // Condensed printing ON
    const condensedOff = esc + "\x12"; // Condensed printing OFF
    const doubleWidthOn = esc + "W1"; // Double width ON
    const doubleWidthOff = esc + "W0"; // Double width OFF
    const doubleHeightOn = "\x1B\x77\x01"; // Correct Double Height ON
    const doubleHeightOff = "\x1B\x77\x00"; // Reset to normal size

    const newLine = "\n"; // Line break
    const formFeed = "\x0C"; // Form feed
    const cutPaper = esc + "i"; // Cut paper command

    let cmds = "";

    // Reset printer and set initial settings
    cmds += reset;

    // cmds += newLine.repeat(2)

    // Customer Details Section - Left aligned with specific spacing
    cmds +=
      "\x1B\x24\x1E\x00" +
      "\x1B\x4A\x55" +
      (invoiceData?.creditorName || "") +
      "\x1B\x24\x7D\x01" +
      "\x1B\x61\x55" +
      " ".repeat(6) +
      // last 12 chrcters of invoice id
      (invoiceData?.invoiceId || "").slice(-10) +
      newLine +
      "\x1B\x24\x1E\x00" +
      "\x1B\x4A\x0A" +
      (invoiceData?.contactNo || "") +
      "\x1B\x24\x7D\x01" +
      "\x1B\x61\x0A" +
      " ".repeat(6) +
      (invoiceData?.issuedTime || "") +
      newLine +
      "\x1B\x24\x1E\x00" +
      "\x1B\x4A\x08" +
      (invoiceData?.vehicle || "") +
      "\x1B\x24\x7D\x01" +
      "\x1B\x61\x08" +
      " ".repeat(6) +
      (invoiceData?.type || "Credit");

    cmds += newLine.repeat(3);

    // // Table Content
    if (Array.isArray(invoiceData?.invoiceItems)) {
      invoiceData.invoiceItems.forEach((item) => {
        cmds +=
          (item.name || "").padEnd(48) +
          "" +
          printRightAlign(item.price || "", 13) +
          "" +
          printRightAlign(item.quantity || "", 7) +
          printRightAlign(item.price * item.quantity || "", 12) +
          newLine;
      });
      if (invoiceData?.vat != null || invoiceData?.vat != 0) {
        cmds +=
          "VAT(ID:114501433-7000)".padEnd(48) +
          "" +
          printRightAlign("", 13) +
          "" +
          printRightAlign("", 7) +
          printRightAlign(invoiceData?.vat || "", 12) +
          newLine;
      }
      cmds += handleVerticalAlignment(invoiceData.invoiceItems.length, 15);
    }

    cmds +=
      boldOn +
      "\x1B\x24\x78\x00" +
      " ".repeat(25) +
      printRightAlign(invoiceData?.totalDiscount || "", 12) +
      " ".repeat(4) +
      printRightAlign("", 6) +
      " ".repeat(1) +
      printRightAlign(invoiceData?.totalPrice || "", 12) +
      boldOff;

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
