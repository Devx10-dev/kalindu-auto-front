// {
//   "creditorID": 512,
//   "shopName": "DN Car Sale",
//   "contactPersonName": "DN Car Sale",
//   "email": "dncarsale@gmail.com",
//   "primaryContact": "0779737738",
//   "secondaryContact": "0779737738",
//   "address": null,
//   "maxDuePeriod": 2,
//   "creditLimit": 100000.00,
//   "totalDue": 10000.00,
//   "status": null,
//   "dueStatus": "DUE",
//   "latestOverdueDays": -2,
//   "latestDueDays": -2,
//   "dueInvoiceCount": 1,
//   "overdueInvoiceCount": 0,
//   "dueAmount": 10000.00,
//   "overdueAmount": 0,
//   "creditInvoices": [
//       {
//           "id": 102,
//           "invoiceId": "INV-CRE-2408181829",
//           "creditorId": null,
//           "issuedTime": [
//               2024,
//               8,
//               18,
//               18,
//               29,
//               11,
//               42735000
//           ],
//           "dueTime": [
//               2024,
//               9,
//               1,
//               18,
//               29,
//               11,
//               42735000
//           ],
//           "totalPrice": 10000.00,
//           "settled": false,
//           "settledAmount": null,
//           "totalDiscount": 0.00,
//           "issuedBy": "b0a8ee5a-b0ec-49db-bef6-cd611b657ecf",
//           "dueStatus": "DUE",
//           "vat": null
//       }
//   ]
// },

export type Creditor = {
  creditorID?: string;
  id?: number;
  shopName?: string;
  contactPersonName?: string;
  email?: string;
  primaryContact?: string;
  secondaryContact?: string;
  address?: string;
  totalDue?: string;
  chequeBalance?: string;
  creditLimit?: number;
  status?: string;
  dueDate?: string;
  isExpired?: string;
  expiredInvoiceList?: any;
  maxDuePeriod?: number;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  daysOverdueOrDueDays?: number;
  dueInvoiceCount?: number;
  overdueInvoiceCount?: number;
  dueAmount?: number;
  overdueAmount?: number;
  creditInvoices?: CreditInvoice[];
  dueStatus?: string;
  latestDueDays?: number;
  latestOverdueDays?: number;
};

export type CreditorResponseData = {
  page: number;
  totalPages: number;
  error?: number;
  creditors: Creditor[];
};

export type CreditorTransaction = {
  creditorTransactionID?: number;
  transactionType?: TransactionType;
  chequeNo?: string;
  invoiceNo?: string;
  totalPrice?: string;
  isPartial?: YesNo;
  status?: Status;
  createdBy?: number;
  createdDate?: Date;
  modifiedBy?: number;
  modifiedDate?: Date;
};

export enum TransactionType {
  INVOICE = "INVOICE",
  TRANSACTION = "TRANSACTION",
}

export enum YesNo {
  YES = "YES",
  NO = "NO",
}

export enum Status {
  ACT = "ACT",
  INA = "INA",
}

export enum TransactionType {
  INVOICE = "INVOICE",
  TRANSACTION = "TRANSACTION",
}

export enum YesNo {
  YES = "YES",
  NO = "NO",
}

export type CreditorTransaction = {
  creditorTransactionID?: number;
  transactionType?: TransactionType;
  chequeNo?: string;
  invoiceNo?: string;
  totalPrice?: string;
  isPartial?: YesNo;
  status?: Status;
  createdBy?: number;
  createdDate?: Date;
  modifiedBy?: number;
  modifiedDate?: Date;
};

export enum TransactionType {
  INVOICE = "INVOICE",
  TRANSACTION = "TRANSACTION",
}

export enum YesNo {
  YES = "YES",
  NO = "NO",
}

export enum Status {
  ACT = "ACT",
  INA = "INA",
}

export enum TransactionType {
  INVOICE = "INVOICE",
  TRANSACTION = "TRANSACTION",
}

export enum YesNo {
  YES = "YES",
  NO = "NO",
}
