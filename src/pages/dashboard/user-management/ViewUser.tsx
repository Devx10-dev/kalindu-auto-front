import { Payment, columns } from "./view-user/table-components/columns";
import { DataTable } from "./view-user/table-components/data-table";

function getData() {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      fullName: "John Doe",
      designation: "Manager",
      email: "john.doe@example.com",
      mobileNumber: "0774567890",
    },
    {
      id: "2",
      fullName: "Jane Smith",
      designation: "Cashier",
      email: "jane.smith@gmail.com",
      mobileNumber: "0778654321",
    },
    {
      id: "3",
      fullName: "Alice Johnson",
      designation: "Cashier",
      email: "alice.johnson@example.com",
      mobileNumber: "0772334455",
    },
    {
      id: "4",
      fullName: "Bob Brown",
      designation: "Cashier",
      email: "bob.brown@example.com",
      mobileNumber: "0775123456",
    },
    {
      id: "5",
      fullName: "Emily Davis",
      designation: "Cashier",
      email: "emily.davis@example.com",
      mobileNumber: "0778444555",
    },
    {
      id: "6",
      fullName: "Charlie Wilson",
      designation: "Owner",
      email: "charlie.wilson@example.com",
      mobileNumber: "0774333222",
    },
  ];
}

export default function userManagementPage() {
  const data = getData();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">User management</h3>
        <p className="text-sm text-muted-foreground">
          View and manage all users in the system.
        </p>
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
