import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import HamburgerIcon from "./icon/HamburgerIcon";
import { MOBILE_SCREEN_WIDTH } from "./sidebar/Sidebar";

function Navbar({
  showDrawer,
  toggleDrawer,
}: {
  showDrawer: boolean;
  toggleDrawer: () => void;
}) {
  const [isMobileView, setIsMobileView] = useState(false);

  console.log(showDrawer);
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
    <nav className="flex items-center justify-between">
      <div className="flex items-center justify-between">
        <div
          style={{ display: `${isMobileView ? "flex" : "none"}` }}
          onClick={toggleDrawer}
        >
          <HamburgerIcon />
        </div>
        <span className="font-bold ml-4 text-blue-50">KALINDU AUTO</span>
      </div>
      <div className="flex gap-5 items-center">
        <Avatar className="mr-5">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}

export default Navbar;
