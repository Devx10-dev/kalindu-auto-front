<<<<<<< HEAD
import { Link, useLocation } from "react-router-dom";
import NavLinks from "./navlinks";


function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-full pr-2 pl-2">
      <ul className="mt-5">
        {NavLinks.map((link) => (
          <li key={link.label} className=" mb-2 ml-2">
            <Link to={link.href}>
              <p className="font-bold flex items-center gap-1">{link.label}</p>
            </Link>
            {link.sublinks && (
              <ul className="ml-2">
                {link.sublinks.map((sublink) => (
                  <li key={sublink.label}>
                    <Link to={sublink.href}>
                      <p
                        className={`font-regular text-sm ${
                          location.pathname === sublink.href
                            ? " bg-slate-300 p-1"
                            : "hover:bg-slate-200 p-1"
                        } rounded-md flex items-center gap-1`}
                      >
                        {/* {sublink.icon} */}
                        {sublink.label}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
=======
import { useCallback, useMemo } from "react";
import NavLinks from "./navlinks";
import { SidebarItem } from "./SidebarItem";

function Sidebar() {
  const sidebarItems = useMemo(() => {
    return NavLinks.map((link) => <SidebarItem key={link.label} link={link} />);
  }, [NavLinks]); 
  return (
    <div className="h-full pr-2 pl-2 w-full">
      <ul className="mt-5">
        {sidebarItems} 
>>>>>>> 81f67c97990a47c271607bd9b51c84531e120b10
      </ul>
    </div>
  );
}

export default Sidebar;