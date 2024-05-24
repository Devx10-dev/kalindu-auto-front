import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function Dashboard() {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <div className="flex flex-col justify-center w-full h-dvh">
      <div className="w-full h-16 p-2 bg-slate-700 border-b-4 border-orange-200">
        <Navbar showDrawer toggleDrawer={() => setShowDrawer(!showDrawer)} />
      </div>
      <div className="flex w-full" style={{ height: "calc(100vh - 4rem)" }}>
        <div
          className="bg-slate-100"
          style={{
            overflowY: "scroll",
            maxHeight: "calc(100vh - 4rem)",
            maxWidth: "300px",
          }}
        >
          <Sidebar showDrawer={showDrawer} toggleDrawer={() => setShowDrawer(!showDrawer)}/>
        </div>
        {/* border: "1px solid black" */}
        <div
          className="pl-6 pr-6 pb-6 pt-1 w-full"
          style={{
            overflowY: "scroll",
            maxHeight: "calc(100vh - 4rem)",
          }}
        >
          <Outlet />
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Dashboard;
