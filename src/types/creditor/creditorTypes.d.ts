export type Creditor = {
  id?: number;
  shopName?: string;
  contactPersonName?: string;
  email?: string;
  primaryContact?: string;
  secondaryContact?: string;
  address?: string;
  maxDuePeriod?: string;
  creditLimit?: number;
  status?: string;
};

export type CreditorResponseData = {
  page: number;
  totalPages: number;
  error?: number;
  creditors:Creditor[];
}
