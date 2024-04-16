import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Keycloak from "./components/auth/Keycloak";
import Dashboard from "./pages/dashboard/Dashboard";
import Error500 from "./pages/error/500";
import VehicleModel from "./pages/sparePart/VehicleModel";
import SpareParts from "./pages/sparePart/SpareParts";
import RegisterCreditor from "./pages/dashboard/creditors/RegisterCreditor";
import CreditorManagement from "./pages/dashboard/creditors/CreditorManagement";
import ViewCreditor from "./pages/dashboard/creditors/ViewCreditor";
import CashInvoice from "./pages/dashboard/invoice/CashInvoice";

function App() {
  return (
    <Routes>
      {/* error pages */}
      <Route path="error/500" element={<Error500 />} />

      {/* secured routes  */}
      <Route path="/" element={<Keycloak />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />}>

          {/* Invoice Routes */}
          <Route path="invoice">
            <Route path="cash" element={<CashInvoice/>}></Route>
          </Route>

          <Route path="vehicle">
            <Route path="model" element={<VehicleModel />} />
            <Route path="part" element={<SpareParts />} />
          </Route>

          {/* Creditor Routes */}
          <Route path="creditors" >
            <Route path="register" element={<RegisterCreditor />} />
            <Route path="manage" element={<CreditorManagement />}>
              <Route path=":id" element={<ViewCreditor />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
