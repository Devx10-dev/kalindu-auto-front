export interface CreditInvoice {
  id?: number;
  invoiceId: string;
  issuedTime: number[];
  totalPrice: number;
  totalDiscount?: number;
  vat?: number;
}
