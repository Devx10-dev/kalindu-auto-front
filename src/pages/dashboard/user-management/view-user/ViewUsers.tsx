import PageHeader from "@/components/card/PageHeader";
import PlusIcon from "@/components/icon/PlusIcon";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { UserService } from "@/service/user/userService";
import { User, UsersResponseData } from "@/types/user/userTypes";
import { useQuery } from "@tanstack/react-query";
import UsersTable from "./table-components/UsersTable";
import UsersIcon from "@/components/icon/UsersIcon";
import { useNavigate } from "react-router-dom";

const REGISTER_USER_PAGE = "/dashboard/users/register";

function ViewUsers() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const userService = new UserService(axiosPrivate);

  const handleAddUserBtn = () => {
    navigate(REGISTER_USER_PAGE);
  };

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
          <Button className="gap-1" onClick={handleAddUserBtn}>
            <PlusIcon height="24" width="24" color="#fff" />
            User
          </Button>
        </div>
        <UsersTable userService={userService} />
      </CardContent>
    </div>
  );
}

export default ViewUsers;
