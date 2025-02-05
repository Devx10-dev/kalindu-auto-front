import React, { useEffect, useRef, useState } from "react";
import * as JSPM from "jsprintmanager";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";

const PrintCreditor2 = () => {
  const [printers, setPrinters] = useState<string[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>("");
  const [printToDefault, setPrintToDefault] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceData = location.state?.invoiceData;

  useEffect(() => {
    const initializePrintManager = async () => {
      JSPM.JSPrintManager.auto_reconnect = true;
      await JSPM.JSPrintManager.start();

      JSPM.JSPrintManager.WS.onStatusChanged = () => {
        if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Open) {
          JSPM.JSPrintManager.getPrinters().then((availablePrinters) => {
            setPrinters(availablePrinters);
          });
        }
      };
    };

    initializePrintManager();
  }, []);

  const handlePrint = () => {
    // if (!invoiceData) {
    //   alert("No invoice data available.");
    //   return;
    // }

    if (!selectedPrinter && !printToDefault) {
      alert("You must select a printer or enable default printing.");
      return;
    }

    let cpj = new JSPM.ClientPrintJob();
    cpj.clientPrinter = printToDefault
      ? new JSPM.DefaultPrinter()
      : new JSPM.InstalledPrinter(selectedPrinter);


      const esc = "\x1B"; // ESC character
      const reset = esc + "@"; // Reset printer
      const boldOn = esc + "E"; // Bold text on
      const boldOff = esc + "F"; // Bold text off
      const smallFont = esc + "M"; // Selects a smaller font
      const normalFont = esc + "P"; // Selects normal font
      const alignCenter = esc + "a1"; // Center alignment
      const alignLeft = esc + "a0"; // Left alignment
      const alignRight = esc + "a2"; // Right alignment
      const cutPaper = esc + "i"; // Cut paper command (if supported)
      const lineBreak = "\n"; // Line break
      const underlineOn = esc + "-1"; // Underline on
      const underlineOff = esc + "-0"; // Underline off
    
      let cmds = reset + smallFont + 
        alignCenter + boldOn + "KALINDU AUTO" + boldOff + lineBreak +
        alignCenter + "Colombo-Kandy Highway, 252/4 Kandy Rd, Yakkala" + lineBreak +
        alignCenter + "Contact: 0332 234 900" + lineBreak +
        alignRight + "INVOICE ID: INV-123456" + lineBreak +
        alignRight + "DATE: Tue, Feb 05, 2025" + lineBreak +
        "--------------------------------------------------------------------------------------------------" + lineBreak +
        
        alignLeft + "Name: ABC Suppliers" + lineBreak +
        "Address: 45 Business Street, City" + lineBreak +
        "Contact: +94 77 123 4567" + lineBreak +
        "--------------------------------------------------------------------------------------------------" + lineBreak +
    
        boldOn + underlineOn + 
        " ITEM NAME            | UNIT PRICE | QTY | TOTAL " + underlineOff + lineBreak +
        "--------------------------------------------------------------------------------------------------" + lineBreak +
        " Engine Oil           | Rs 2500    | 2   | Rs 5000" + lineBreak +
        " Brake Fluid          | Rs 1800    | 1   | Rs 1800" + lineBreak +
        " Car Battery          | Rs 12000   | 1   | Rs 12000" + lineBreak +
        "------------------------------------------------------" + lineBreak +
    
        alignRight + "Total:         Rs 16,800" + lineBreak +
        alignRight + "Discount:      Rs 500" + lineBreak +
        alignRight + "VAT:           Rs 750" + lineBreak +
        alignRight + "SUB TOTAL:     Rs 17,050" + lineBreak +
        "------------------------------------------------------" + lineBreak +
    
        "NOTES:" + lineBreak +
        "  - Thank you for your business!" + lineBreak +
        "  - Please keep this invoice for your records." + lineBreak +
        "------------------------------------------------------" + lineBreak +
    
        alignCenter + boldOn + "THANK YOU!" + boldOff + lineBreak +
        cutPaper;
    
    cpj.printerCommands = cmds.trim();
    cpj.sendToClient();
  };

  return (
    <div>
      <div>
        <h1>Creditor Invoice</h1>
        <fieldset>
          <legend>Printer Selection</legend>
          <label>
            <input
              type="checkbox"
              checked={printToDefault}
              onChange={(e) => setPrintToDefault(e.target.checked)}
            />
            Print to Default Printer
          </label>
          <br />
          <select
            value={selectedPrinter}
            onChange={(e) => setSelectedPrinter(e.target.value)}
            disabled={printToDefault}
          >
            <option value="">Select Printer</option>
            {printers.map((printer) => (
              <option key={printer} value={printer}>
                {printer}
              </option>
            ))}
          </select>
        </fieldset>
      </div>
      <Button onClick={handlePrint}>Print Invoice</Button>
      <Link to={"/dashboard/invoice/creditor"}>
        <Button onClick={() => navigate("")} variant="outline">
          Cancel
        </Button>
      </Link>
    </div>
  );
};

export default PrintCreditor2;