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
