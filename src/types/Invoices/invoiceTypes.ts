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
