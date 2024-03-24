import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import ViewUser from "./pages/dashboard/user-management/ViewUser"
import RegiserUser from "./pages/dashboard/user-management/RegisterUser"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard/>} >

            {/* Routes for user management */}
            <Route path="/dashboard/user-management" element={<ViewUser/>} />
            <Route path="/dashboard/user-management/register" element={<RegiserUser/>} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
