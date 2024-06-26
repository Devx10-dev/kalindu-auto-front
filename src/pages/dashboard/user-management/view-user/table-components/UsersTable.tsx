// import { ViewEditCreditor } from "./ViewEditCreditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import React, { useState } from "react";
// import TablePagination from "../../../../components/TablePagination";
import IconButton from "@/components/button/IconButton";
import EditIcon from "@/components/icon/EditIcon";
import LockIcon from "@/components/icon/LockIcon";
import UnlockIcon from "@/components/icon/UnlockIcon";
import SkeletonGrid from "@/components/loader/SkeletonGrid";
import { ConfirmationModal } from "@/components/modal/ConfirmationModal";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { UserService } from "@/service/user/userService";
import { User } from "@/types/user/userTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const USER_EDIT_PAGE = "/dashboard/users/edit";

const UsersTable = ({
  users,
  userService,
  isLoading,
}: {
  users: User[];
  userService: UserService;
  isLoading: boolean;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (user: User) => {
    const encodedData = encodeURIComponent(JSON.stringify(user));
    navigate(USER_EDIT_PAGE + `?data=${encodedData}`);
  };

  const handleActiveOrInactive = (user: User) => {
    setShow(true);
    setTitle(`${user.active ? "Deactivate" : "Activate"} User! `);
    setDescription(
      `Are you sure you want to ${user.active ? "deactivate" : "activate"} user ${user.fullName}?`,
    );

    setUser(user);
  };

  const activeOrInactiveUser = async () => {
    await updateUserMutation.mutateAsync();
  };

  const updateUserMutation = useMutation({
    mutationFn: () => userService.activeOrInactiveUser(user),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully updated user.",
      });

      setShow(false);
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "User update is failed",
        description: data.message,
        duration: 3000,
      });

      setShow(false);
    },
  });

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
        {isLoading ? (
          <SkeletonGrid noOfColumns={7} noOfItems={10} />
        ) : (
          <Table className="border rounded-md text-md mb-5">
            <TableCaption>User Details</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Mobile No</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users &&
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.designation}</TableCell>
                    <TableCell>{user.mobileNo}</TableCell>
                    <TableCell>{user.address ?? "-"}</TableCell>
                    <TableCell>
                      {user.active ? (
                        <Badge variant="outline">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="d-flex">
                        <IconButton
                          handleOnClick={() => handleEdit(user)}
                          icon={<EditIcon height="20" width="20" />}
                          tooltipMsg="Edit User"
                          variant="ghost"
                        />
                        {user.active ? (
                          <IconButton
                            handleOnClick={() => handleActiveOrInactive(user)}
                            icon={<LockIcon height="20" width="20" />}
                            tooltipMsg="Deactivate User"
                            variant="ghost"
                          />
                        ) : (
                          <IconButton
                            handleOnClick={() => handleActiveOrInactive(user)}
                            icon={<UnlockIcon height="20" width="20" />}
                            tooltipMsg="Activate User"
                            variant="ghost"
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
        <ConfirmationModal
          onClose={() => setShow(false)}
          onConfirm={activeOrInactiveUser}
          show={show}
          title={title}
          titleDescription={description}
        />
      </div>
    </>
  );
};

export default UsersTable;
