export type Creditor = {
  creditorID?: string;
  id?: number;
  shopName?: string;
  contactPersonName?: string;
  email?: string;
  primaryContact?: string;
  secondaryContact?: string;
  address?: string;
  maxDuePeriod?: string;
  creditLimit?: string;
  status?: string;
  
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
  INVOICE = 'INVOICE',
  TRANSACTION = 'TRANSACTION',
}

export enum YesNo {
  YES = 'YES',
  NO = 'NO',
}

export enum Status {
  ACT = 'ACT',
  INA = 'INA',
}

export enum TransactionType {
  INVOICE = 'INVOICE',
  TRANSACTION = 'TRANSACTION',
}

export enum YesNo {
  YES = 'YES',
  NO = 'NO',
}