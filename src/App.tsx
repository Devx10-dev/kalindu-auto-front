import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import ViewUser from "./pages/dashboard/user-management/ViewUser"
import RegiserUser from "./pages/dashboard/user-management/RegisterUser"
import Keycloak from "./components/auth/Keycloak";
import Error500 from "./pages/error/500";
import VehicleModel from "./pages/sparePart/VehicleModel";
import SpareParts from "./pages/sparePart/SpareParts";
import RegisterCreditor from "./pages/dashboard/creditors/RegisterCreditor";
import CreditorManagement from "./pages/dashboard/creditors/CreditorManagement";
import ViewCreditor from "./pages/dashboard/creditors/ViewCreditor";


function App() {
  return (
  
    <Routes>
      {/* error pages */}
      <Route path="error/500" element={<Error500 />} />

      {/* secured routes  */}
      <Route path="/" >
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route path="vehicle">
            <Route path="model" element={<VehicleModel />} />
            <Route path="part" element={<SpareParts />} />
          </Route>
          {/* <Route
            path="/dashboard/creditors/manage/:id"
            element={<ViewCreditor />}
          /> */}
          <Route path="creditors" >
            <Route path="register" element={<RegisterCreditor />} />
            <Route path="manage" element={<CreditorManagement />}>
              <Route path=":id" element={<ViewCreditor />} />
            </Route>
          </Route>
          {/* <Route`
            path="/dashboard/creditors/manage"
            element={<CreditorManagement />}
          /> */}
          {/* <Route path="/dashboard/creditors/:id" element={<ViewCreditor />} /> */}

          <Route path="users">

            {/* Routes for user management */}
            <Route path="user-list" element={<ViewUser/>} />
            <Route path="register" element={<RegiserUser/>} />
          </Route>
        </Route>
      </Route>
    </Routes>

  );
}

export default App;
