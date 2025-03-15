export type Invoice = {
  id?: number;
  invoiceNo?: string;
  customerName?: string;
  customerId?: number;
  invoiceDate?: string;
  dueDate?: string;
  totalAmount?: number;
  status?: string;
};

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  discount: number;
  sparePartId: number;
}

export interface InvoiceData {
  vat: number;
  commissions: any[];
  creditorId?: number;
  creditorName?: string;
  invoiceId: string;
  invoiceItems: InvoiceItem[];
  totalDiscount: number;
  totalPrice: number;
}
