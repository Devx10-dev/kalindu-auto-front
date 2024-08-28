// address
// :
// null
// contactPersonName
// :
// "Harsha"
// createdBy
// :
// null
// createdDate
// :
// null
// creditLimit
// :
// 10000
// creditorID
// :
// 52
// dueDate
// :
// null
// email
// :
// "harsha@gmail.com"
// expiredInvoiceList
// :
// null
// isExpired
// :
// null
// maxDuePeriod
// :
// 1
// modifiedBy
// :
// null
// modifiedDate
// :
// null
// primaryContact
// :
// "0776650827"
// secondaryContact
// :
// "0348759490"
// shopName
// :
// "Chathuramga"
// status
// :
// null
// totalDue
// :
// 0

// {
//   "creditorID": 6,
//   "shopName": "nisal new",
//   "contactPersonName": "Avishka Sathyanjana",
//   "email": "baavishka@gmail.com",
//   "primaryContact": "0701097409",
//   "secondaryContact": "0701097409",
//   "address": "48/55, Epitamulla Road, Pitakotte",
//   "maxDuePeriod": 1,
//   "creditLimit": 2000.00,
//   "totalDue": 1.00,
//   "status": null,
//   "createdBy": "b0a8ee5a-b0ec-49db-bef6-cd611b657ecf",
//   "createdDate": 1721035263288,
//   "modifiedBy": "b0a8ee5a-b0ec-49db-bef6-cd611b657ecf",
//   "modifiedDate": 1722882515179,
//   "dueDate": null,
//   "isExpired": null,
//   "expiredInvoiceList": null,
//   "daysOverdueOrDueDays": 11,
//   "dueInvoiceCount": 1,
//   "overdueInvoiceCount": 1
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
  creditLimit?: number;
  status?: string;
  dueDate?: string;
  isExpired?: string;
  expiredInvoiceList?: any;
  maxDuePeriod?: string;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  daysOverdueOrDueDays?: number;
  dueInvoiceCount?: number;
  overdueInvoiceCount?: number;
  
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


export type OverdueCreditors = {
  overdue?: Creditor[];
  due?: Creditor[];
}
