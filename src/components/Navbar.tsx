import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import HamburgerIcon from "./icon/HamburgerIcon";
import { MOBILE_SCREEN_WIDTH } from "./sidebar/Sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import useAuth from "@/hooks/useAuth";
import { UserService } from "@/service/user/userService";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user/userTypes";
import { getUsername, logout } from "./auth/Keycloak";

function Navbar({
  showDrawer,
  toggleDrawer,
}: {
  showDrawer: boolean;
  toggleDrawer: () => void;
}) {
  const { roles } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [isMobileView, setIsMobileView] = useState(false);
  const [username, setUsername] = useState<string>();

  const userService = new UserService(axiosPrivate);

  useEffect(() => {
    async function getUserProfile() {
      await getUsername(setUsername);
    }

    getUserProfile();
  }, []);

  const { data: user } = useQuery<User>({
    queryKey: ["user", username],
    queryFn: () => userService.fetchUserProfileDetails(username),
    retry: 2,
  });

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    function checkScreenWidth() {
      setIsMobileView(window.innerWidth < MOBILE_SCREEN_WIDTH);
    }

    // Initial check
    checkScreenWidth();

    // Listen for screen resize events
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []); // Only run this effect once on component mount

  return (
    <nav className="flex items-center justify-between mr-4">
      <div className="flex items-center justify-between">
        <div
          style={{ display: `${isMobileView ? "flex" : "none"}` }}
          onClick={toggleDrawer}
        >
          <HamburgerIcon />
        </div>
        <span className="font-bold ml-4 text-blue-50"> </span>
        <img src="/kalindu-logo.png" className="w-24" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            {user && user.gender === "Female" ? (
              <Avatar>
                <AvatarImage src="/public/profile/girl.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar>
                <AvatarImage src="/public/profile/boy.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{`Hi ${username}`}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export default Navbar;
