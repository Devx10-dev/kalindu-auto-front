import NavLinks from "./navlinks";
import { SidebarItem } from "./SidebarItem";

function Sidebar() {

  return (
    <div className="h-full pr-2 pl-2 w-full">
      <ul className="mt-5">
        {NavLinks.map((link) => (
            <SidebarItem link={link} />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;