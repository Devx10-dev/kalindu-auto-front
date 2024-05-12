export type InvoiceState = {
    creditorName?: string;
    creditorID? : number;
    invoiceItemDTOList: InvoiceItem[]; 
    addInvoiceItem: (item: InvoiceItem) => void;
    removeInvoiceItem : (item: InvoiceItem) => void;
    setCreditor : (name? : string, id? : number) => void;
    setOutsourcedStatus : (item: InvoiceItem, status: boolean) => void;
    getOutsourcedItems  : () => InvoiceItem[];
  }
  
  export type InvoiceItem = {
    invoiceID?: string;
    itemName?: string;
    vehicleNo?: string;
    code?: string;
    totalPrice?: string | number; 
    VAT?: string | number;
    code?: string;
    outsourcedStatus? : boolean;
    companyName? : string;
    buyingPrice? : float;
  }
  