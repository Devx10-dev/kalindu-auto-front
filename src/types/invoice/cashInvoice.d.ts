export type InvoiceItem = {
  itemName?: string;
  code?: string;
  price?: number;
  quantity?: number;
  discount?: number;
  description?: string;
  outsourcedStatus?: boolean;
  outsourceItem?: {
    companyName?: string;
    buyingPrice?: number;
  };
};

export type InvoiceState = {
  id?: number;
  invoiceId?: string;
  issuedTime?: Date;
  customerName?: string;
  vehicleNumber?: string;
  totalPrice?: number;
  invoiceItemDTOList: InvoiceItem[];

  discountPercentage?: number;
  discountAmount?: number;
  vatPercentage?: number;
  vatAmount?: number;

  commissionName?: string;
  commissionRemark?: string;
  commissionAmount?: number;

  setCustomer: (name?: string) => void;
  setVehicleNumber: (number?: string) => void;

  addInvoiceItem: (item: InvoiceItem) => void;
  removeInvoiceItem: (item: InvoiceItem) => void;

  setOutsourcedStatus: (item: InvoiceItem, status: boolean) => void;
  getOutsourcedItems: () => InvoiceItem[];
  setOutsourcedCompanyName: (item: InvoiceItem, companyName: string) => void;
  setOutsourcedBuyingPrice: (item: InvoiceItem, buyingPrice: number) => void;

  setDiscountPercentage: (percentage: number) => void;
  setDiscountAmount: (amount: number) => void;
  setVatPercentage: (percentage: number) => void;
  setVatAmount: (amount: number) => void;
  setTotalPrice: (price: number) => void;

  setCommissionName: (name?: string) => void;
  setCommissionRemark: (remark?: string) => void;
  setCommissionAmount: (amount?: number) => void;

  getRequestData: () => any;
};

// Map<String, Object> responseData = new HashMap<>();
// responseData.put("invoices", invoiceDTOS);
// responseData.put("currentPage", invoicePage.getNumber());
// responseData.put("totalItems", invoicePage.getTotalElements());
// responseData.put("totalPages", invoicePage.getTotalPages());

export type InvoiceList = {
  invoices: InvoiceState[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
};
