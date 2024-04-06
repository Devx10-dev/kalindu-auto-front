import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";

import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className="flex flex-col justify-center w-full h-dvh">
      <div className="w-full h-16 p-2 bg-slate-700 border-b-4 border-orange-200">
        <Navbar />
      </div>
      <div className="flex flex-row h-full w-full">
        <div className="w-1/6 h-full bg-slate-100">
          <Sidebar />
        </div>
        <div className="p-6 w-5/6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
