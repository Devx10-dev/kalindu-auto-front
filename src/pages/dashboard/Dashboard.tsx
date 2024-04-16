<<<<<<< HEAD
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="flex flex-col justify-center w-screen h-screen">
    <div className="w-full h-12 bg-gray-900 border-b-2 border-slate-200">
      <Navbar />
    </div>
    <div className="flex flex-row h-full w-full">
      <div className="w-64 h-full bg-slate-100">
        <Sidebar />
      </div>
      <div className="p-6 w-full"><Outlet /></div>
    </div>
  </div>
  )
}

export default Dashboard
=======
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { Toaster } from "@/components/ui/toaster"
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
      <Toaster />
    </div>
  );
}

export default Dashboard;
>>>>>>> 81f67c97990a47c271607bd9b51c84531e120b10
