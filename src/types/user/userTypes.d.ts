export type User = {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  address?: string;
  mobileNo: string;
  homeNo?: string;
  roles: string[];
  active: boolean;
  designation: Designation;
};

export type Designation = "Manager" | "Cashier" | "Owner" | "User";
