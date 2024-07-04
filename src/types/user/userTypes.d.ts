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
  gender: Gender;
  designation: Designation;
};

export type Gender = "Male" | "Female" | "Non Binary";
export type Designation = "Manager" | "Cashier" | "Owner" | "User";
