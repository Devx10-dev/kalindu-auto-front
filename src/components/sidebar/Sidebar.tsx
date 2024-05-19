import { useEffect, useMemo, useState } from "react";
import DoubleLeftIcon from "../icon/DoubleLeftIcon";
import { Drawer, DrawerContent } from "../ui/drawer";
import { SidebarItem } from "./SidebarItem";
import NavLinks from "./navlinks";

export const MOBILE_SCREEN_WIDTH = 1000;

function Sidebar({
  showDrawer,
  toggleDrawer,
}: {
  showDrawer: boolean;
  toggleDrawer: () => void;
}) {
  console.log(showDrawer);
  const [isMobileView, setIsMobileView] = useState(false);

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

  const sidebarItems = useMemo(() => {
    return NavLinks.map((link) => <SidebarItem key={link.label} link={link} />);
  }, []);

  const sidebarComponent = (
    <div className="h-full pl-1 w-full pb-4">
      <ul className="mt-4">{sidebarItems}</ul>
    </div>
  );

  return (
    <>
      {/* Sidebar for larger screens */}
      {!isMobileView && (
        <div className="h-full pl-1 w-full pb-4">{sidebarComponent}</div>
      )}

      {/* Drawer for smaller screens */}
      {isMobileView && (
        <div className="sidebar-drawer">
          <Drawer open={showDrawer} direction="left">
            <DrawerContent
              style={{
                // overflowY: "scroll",
                height: "calc(100vh - 4rem)",
                maxWidth: "260px",
                padding: 0,
                margin: 0,
              }}
            >
              <div className="d-flex justify-end m-0 mr-2 mb-2">
                <div
                  style={{
                    background: "#ddd",
                    borderRadius: 4,
                    padding: 5,
                    cursor: "pointer",
                  }}
                  onClick={toggleDrawer}
                >
                  <DoubleLeftIcon height="16" width="16" />
                </div>
              </div>
              <div
                style={{
                  overflowY: "scroll",
                  height: "calc(100vh - 4rem)",
                }}
              >
                {sidebarComponent}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </>
  );
}

export default Sidebar;
