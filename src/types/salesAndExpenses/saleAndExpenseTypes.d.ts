export interface Category {
  id?: number;
  name: string;
}

export interface Field {
  id?: number;
  name: string;
  category?: Category;
}

export interface SaleOrExpense {
  id?: number;
  amount: number;
  reason: string;
  dateTime?: string;
  field: Field;
  expense: boolean;
}

export interface DailySummery {
  id?: number;
  salesAmount: number;
  expensesAmount: number;
  date: string;
  verified: boolean;
  expenses: SaleOrExpense[];
  sales: SaleOrExpense[];
}
