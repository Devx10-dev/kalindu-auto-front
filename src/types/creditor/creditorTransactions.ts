// {
//     "creditorTransactionID": 403,
//     "creditorID": null,
//     "transactionType": "CASH",
//     "chequeID": null,
//     "invoiceIDs": null,
//     "chequeNo": null,
//     "totalPrice": 20000,
//     "isPartial": "no",
//     "status": "ACT",
//     "createdBy": "null",
//     "createdDate": null,
//     "modifiedBy": null,
//     "modifiedDate": null,
//     "transactionInvoices": [
//       {
//         "id": 3,
//         "creditorTransactionId": 403,
//         "creditorInvoice": {
//           "id": 34,
//           "invoiceId": "INV-CRE-2408263585",
//           "creditorId": null,
//           "issuedTime": [
//             2024,
//             8,
//             26,
//             23,
//             36,
//             30,
//             286772000
//           ],
//           "dueTime": [
//             2024,
//             9,
//             5,
//             23,
//             40,
//             40,
//             670893000
//           ],
//           "totalPrice": 1000000,
//           "settled": false,
//           "settledAmount": 10000,
//           "totalDiscount": 0,
//           "issuedBy": "b0a8ee5a-b0ec-49db-bef6-cd611b657ecf",
//           "dueStatus": "OVERDUE",
//           "vat": null
//         },
//         "settledAmount": 10000
//       },
//       {
//         "id": 2,
//         "creditorTransactionId": 403,
//         "creditorInvoice": {
//           "id": 152,
//           "invoiceId": "INV-CRE-2408222340",
//           "creditorId": null,
//           "issuedTime": [
//             2024,
//             8,
//             22,
//             23,
//             40,
//             40,
//             670893000
//           ],
//           "dueTime": [
//             2024,
//             9,
//             5,
//             23,
//             40,
//             40,
//             670893000
//           ],
//           "totalPrice": 10000,
//           "settled": true,
//           "settledAmount": 10000,
//           "totalDiscount": 0,
//           "issuedBy": "b0a8ee5a-b0ec-49db-bef6-cd611b657ecf",
//           "dueStatus": "COMPLETED",
//           "vat": null
//         },
//         "settledAmount": 10000
//       }
//     ]
//   }

export enum TransactionType {
  CASH = "CASH",
  CHEQUE = "CHEQUE",
  DEPOSIT = "DEPOSIT",
}

export enum YesNo {
  YES = "yes",
  NO = "no",
}

export enum Status {
  ACT = "ACT",
  INA = "INA",
}

export type TransactionInvoice = {
  id?: number;
  creditorTransactionId?: number;
  creditorInvoice?: {
    id?: number;
    invoiceId?: string;
    creditorId?: number;
    issuedTime?: number[];
    dueTime?: number[];
    totalPrice?: number;
    settled?: boolean;
    settledAmount?: number;
    totalDiscount?: number;
    issuedBy?: string;
    dueStatus?: string;
    vat?: any;
  };
  settledAmount?: number;
};

export type CreditorTransaction = {
  creditorTransactionID?: number;
  creditorID?: number;
  transactionType?: TransactionType;
  chequeID?: number;
  invoiceIDs?: string;
  chequeNo?: string;
  totalPrice?: number;
  isPartial?: YesNo;
  status?: Status;
  createdBy?: string;
  createdDate?: number[];
  modifiedBy?: number;
  modifiedDate?: number[];
  transcationInvoices?: TransactionInvoice[];
};

export type TransactionList = {
  creditorTransactions?: CreditorTransaction[];
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
};
