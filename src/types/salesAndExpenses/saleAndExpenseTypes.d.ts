export interface Category {
  id?: number;
  name: string;
}

export interface Field {
  id?: number;
  name: string;
  category?: Category;
}

export type FinancialRecordType =
  | "SALE"
  | "EXPENSE"
  | "CREDIT_BALANCE"
  | "UNSETTLED_CHEQUE_BALANCE";

export interface FinancialRecord {
  id?: number;
  amount: number;
  reason: string;
  dateTime?: number[];
  date: string;
  field: Field;
  type: FinancialRecordType;
}

export interface DailySummery {
  id?: number;
  saleAmount: number;
  expenseAmount: number;
  creditBalance: number;
  unsettledChequeAmount: number;
  date: string;
  verified: boolean;
  financialRecords: FinancialRecord[];
}
