export type User = {
  id: number;
  username: string;
  firstName: string;
  //   lastName: string;
  //   email?: string;
  //   address?: string;
  mobileNo: string;
  //   homeNo?: string;
  designation: Designation;
  //   modifiedBy: string;
};

export type Designation = "Manager" | "Cashier" | "Owner";
