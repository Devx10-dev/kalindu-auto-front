import PageHeader from "@/components/card/PageHeader";
import PlusIcon from "@/components/icon/PlusIcon";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { UserService } from "@/service/user/userService";
import { User } from "@/types/user/userTypes";
import { useQuery } from "@tanstack/react-query";
import UsersTable from "./table-components/UsersTable";
import UsersIcon from "@/components/icon/UsersIcon";

function ViewUsers() {
  const axiosPrivate = useAxiosPrivate();
  const userService = new UserService(axiosPrivate);

  const { isLoading, data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => userService.fetchUsers(),
    retry: 2,
  });

  return (
    <div className="mr-2 ml-2">
      <CardHeader>
        <PageHeader
          title="Users"
          description="Manage all user details."
          icon={<UsersIcon height="30" width="28" color="#162a3b" />}
        />
      </CardHeader>
      <CardContent style={{ width: "98%" }}>
        <div className="mb-3">
          <Button className="gap-1">
            <PlusIcon height="24" width="24" color="#fff" />
            User
          </Button>
        </div>
        <UsersTable
          users={users}
          userService={userService}
          isLoading={isLoading}
        />
      </CardContent>
    </div>
  );
}

export default ViewUsers;
