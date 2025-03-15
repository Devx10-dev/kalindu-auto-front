import React, { useEffect, useState } from "react";
import * as JSPM from "jsprintmanager";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";

const printRightAlign = (value: string | number, totalLength: number) => {
  const strValue = value.toString();
  return " ".repeat(Math.max(0, totalLength - strValue.length)) + strValue;
};

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
    cmds += reset 

    // cmds += newLine.repeat(2)

    // Customer Details Section - Left aligned with specific spacing
    cmds += "\x1B\x24\x1E\x00" + "\x1B\x4A\x55" + (invoiceData?.name || "Harsha Gunawardane ") + "\x1B\x24\x7D\x01" +"\x1B\x61\x55"+ " ".repeat(6) + (invoiceData?.invoiceNo || "2408211133") + newLine
      + "\x1B\x24\x1E\x00" + "\x1B\x4A\x0A"  + (invoiceData?.contact || "0717272828") + "\x1B\x24\x7D\x01" +"\x1B\x61\x0A"+ " ".repeat(6) + (invoiceData?.date || "2025-01-03") + newLine
      + "\x1B\x24\x1E\x00" + "\x1B\x4A\x08" + (invoiceData?.vehicle || "ABC") + "\x1B\x24\x7D\x01" +"\x1B\x61\x08"+ " ".repeat(6)  + (invoiceData?.sale || "def");

    cmds += newLine.repeat(3)

    // // Table Content
    if (Array.isArray([1, 2])) {
      // [1, 2,3,4,5,6,7,8,9,1,2,3,4,5,6,7].forEach(item => {
      //   cmds +=  (item.name || "Bufferrrrrrrrr").padEnd(19) + "" +
      //     (item.code || "BF").padEnd(9) + "" +
      //     (item.description || "Dessssssssssssssss").padEnd(20) + "" +
      //     printRightAlign(item.rate || "8", 13) + "" + 
      //     printRightAlign(item.qty || "2", 7) + 
      //     printRightAlign(item.price || "200000.00", 12)+ newLine;
      // });
      cmds += newLine.repeat(14)
    }

    cmds += "\x1B\x24\x78\x00" + " ".repeat(12) + printRightAlign("200000.00", 6)+  (invoiceData?.invoiceNo || "2408211133")

    // Final commands
    cmds += formFeed + cutPaper;

    cpj.printerCommands = cmds.trim();
    cpj.sendToClient();
  };

  return (
    <div>
      <div>
        <h1>Print Invoice</h1>
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
      <Link to="/dashboard/invoice/creditor">
        <Button variant="outline">Cancel</Button>
      </Link>
    </div>
  );
};

export default PrintCreditor2;