// import { ViewEditCreditor } from "./ViewEditCreditor";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, View } from "lucide-react";
// import TablePagination from "../../../../components/TablePagination";
import { Link } from "react-router-dom";
import { User } from "@/types/user/userTypes"

const UsersTable = (props:{userData?:User[]}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col justify-end">
        <div className="mb-4 flex gap-10">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search users..."
            className="w-1/4"
          />
          <Button variant={"secondary"}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
        <Table className="border rounded-md text-md mb-5">
          <TableCaption>User Details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Mobile No</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.userData?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.mobileNo}</TableCell>
                <TableCell>{user.designation}</TableCell>
                <TableCell className="text-right">
                  <Link to={"/dashboard/users/manage/1"}>
                    <Button className="mr-5 bg-slate-200 text-black hover:bg-slate-600 hover:text-white">
                      <View className="mr-2 h-4 w-4" />
                      View Activities
                    </Button>
                  </Link>
                  {/* <ViewEditUser /> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </>
  );
};

export default UsersTable;
