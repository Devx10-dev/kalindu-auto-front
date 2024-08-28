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

// responseData.put("users", users.getContent());
// responseData.put("currentPage", users.getNumber());
// responseData.put("totalItems", users.getTotalElements());
// responseData.put("totalPages", users.getTotalPages());
export type UsersResponseData = {
  users: User[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export type Gender = "Male" | "Female" | "Non Binary";
export type Designation = "Manager" | "Cashier" | "Owner" | "User";
