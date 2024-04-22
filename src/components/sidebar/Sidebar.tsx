import { useMemo } from "react";
import { SidebarItem } from "./SidebarItem";
import NavLinks from "./navlinks";

function Sidebar() {
  const sidebarItems = useMemo(() => {
    return NavLinks.map((link) => <SidebarItem key={link.label} link={link} />);
  }, [NavLinks]); 
  return (
    <div className="h-full pr-2 pl-2 w-full">
      <ul className="mt-5">
        {sidebarItems} 
      </ul>
    </div>
  );
}

export default Sidebar;