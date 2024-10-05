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

export type TransactionTypes = "CASH" | "DEPOSIT" | "CHEQUE";
