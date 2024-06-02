import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className="flex flex-col justify-center w-full h-dvh">
      <div className="w-full h-16 p-2 bg-slate-700 border-b-4 border-orange-200">
        <Navbar />
      </div>
      <div
        className="flex flex-row w-full"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="w-1/6 h-fit bg-slate-100">
          <Sidebar />
        </div>
        <div className="p-6 w-5/6">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Dashboard;
