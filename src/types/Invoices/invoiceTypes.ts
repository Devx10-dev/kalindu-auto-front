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
  name?: string;
  quantity?: number;
  price?: number;
  discount?: number;
  sparePartId?: number;
  code?: string;
  description?: string;
}

export interface InvoiceData {
  vat?: number;
  commissions?: any[];
  creditorId?: number | string;
  creditorName?: string;
  invoiceId?: string;
  invoiceItems?: InvoiceItem[];
  totalDiscount?: number;
  totalPrice?: number;
  contactNo?: string;
  vehicle?: string;
  date?: string;
  type?: string;
  issuedTime?: string;
}
