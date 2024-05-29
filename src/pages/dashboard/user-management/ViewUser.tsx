import UsersTable from "./view-user/table-components/UsersTable";

function getData() {
  return [
    {
      id: "1",
      username: "john.doe",
      firstName: "John",
      mobileNo: "0774567890",
      designation: "Manager",
    },
    {
      id: "2",
      username: "jane.smith",
      firstName: "Jane",
      mobileNo: "0778654321",
      designation: "Cashier",
    },
    {
      id: "3",
      username: "alice.johnson",
      firstName: "Alice",
      mobileNo: "0772334455",
      designation: "Cashier",
    },
    {
      id: "4",
      username: "bob.brown",
      firstName: "Bob",
      mobileNo: "0775123456",
      designation: "Cashier",
    },
    {
      id: "5",
      username: "emily.davis",
      firstName: "Emily",
      mobileNo: "0778444555",
      designation: "Cashier",
    },
    {
      id: "6",
      username: "charlie.wilson",
      firstName: "Charlie",
      mobileNo: "0774333222",
      designation: "Owner",
    },
  ];
}

export default function userManagementPage() {
  const data = getData();

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold">User management</h3>
          <p className="text-sm text-muted-foreground">
            View and manage all users in the system.
          </p>
        </div>
        <div className="w-full">
          <UsersTable userData={data} />
        </div>
      </div>
    </>
  );
}
