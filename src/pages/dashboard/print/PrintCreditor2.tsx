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
    if (!invoiceData) {
      alert("No invoice data available.");
      return;
    }

    if (!selectedPrinter && !printToDefault) {
      alert("You must select a printer or enable default printing.");
      return;
    }

    let cpj = new JSPM.ClientPrintJob();
    cpj.clientPrinter = printToDefault
      ? new JSPM.DefaultPrinter()
      : new JSPM.InstalledPrinter(selectedPrinter);

    const cmds = `
      ^XA
      ^FO20,30^GB750,1100,4^FS
      ^FO20,30^GB750,200,4^FS
      ^FO30,40^ADN,36,20^FDKALINDU AUTO^FS
      ^FO30,80^ADN,20,10^FDColombo-Kandy Highway, 252/4 Kandy Rd, Yakkala^FS
      ^FO30,120^ADN,20,10^FDContact: 0332 234 900^FS
      ^FO30,200^ADN,36,20^FDCreditor Invoice^FS
      ^FO30,260^ADN,20,10^FDINVOICE: ${invoiceData.invoiceId}^FS
      ^FO30,300^ADN,20,10^FDDate: ${new Date().toDateString()}^FS
      ^FO30,400^ADN,20,10^FDCreditor: ${invoiceData.creditor.shopName}^FS
      ^FO30,440^ADN,20,10^FDAddress: ${invoiceData.creditor.address || "N/A"}^FS
      ^FO30,480^ADN,20,10^FDContact: ${invoiceData.creditor.primaryContact}^FS
      ^FO30,520^GB750,2^FS
      ${invoiceData.invoiceItems
        .map(
          (item: any, index: number) => `
          ^FO30,${600 + index * 40}^ADN,18,10^FD${item.name} - ${item.description}^FS
          ^FO400,${600 + index * 40}^ADN,18,10^FDPrice: Rs ${item.price}, Qty: ${item.quantity}, Discount: Rs ${item.discount}^FS
        `
        )
        .join("")}
      ^FO30,${700 + invoiceData.invoiceItems.length * 40}^GB750,2^FS
      ^FO30,${750 + invoiceData.invoiceItems.length * 40}^ADN,20,10^FDTotal: Rs ${
      invoiceData.totalPrice
    }, VAT: Rs ${invoiceData.VAT}, Discount: Rs ${
      invoiceData.totalDiscount
    }^FS
      ^XZ
    `;
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