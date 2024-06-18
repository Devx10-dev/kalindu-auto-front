import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Keycloak from "./components/auth/Keycloak";
import Dashboard from "./pages/dashboard/Dashboard";
import CreditorManagement from "./pages/dashboard/creditors/CreditorManagement";
import RegisterCreditor from "./pages/dashboard/creditors/RegisterCreditor";
import ViewCreditor from "./pages/dashboard/creditors/ViewCreditor";
import CashInvoice from "./pages/dashboard/invoice/cash/CashInvoice";
import RegiserUser from "./pages/dashboard/user-management/RegisterUser";
import Error500 from "./pages/error/500";
import VehicleModel from "./pages/sparePart/VehicleModel";
import SpareParts from "./pages/sparePart/SpareParts";
import DailySalesBase from "./pages/dashboard/reports/daily-sales-expenses/DailySalesBase";
import CreditorInvoiceBase from "./pages/dashboard/invoice/creditor/CreditorInvoiceBase";
import DummyInvoice from "./pages/dashboard/invoice/dummy/DummyInvoice";
import RegisterUser from "./pages/dashboard/user-management/RegisterUser";
import ActivityLog from "./pages/log/ActivityLog";
import ViewUsers from "./pages/dashboard/user-management/view-user/ViewUsers";
import EditUser from "./pages/dashboard/user-management/EditUser";
import { ViewAllInvoices } from "./pages/dashboard/invoice/view-invoices/ViewAllInvoices";
import SingleInvoice from "./pages/dashboard/invoice/view/SingleInvoice";

function App() {
  return (
    <Routes>
      {/* error pages */}
      <Route path="error/500" element={<Error500 />} />

      {/* secured routes  */}
      {/* <Route path="/" > */}
      <Route path="/" element={<Keycloak />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />}>
          {/* Invoice Routes */}
          <Route path="invoice">
            <Route path="cash" element={<CashInvoice />} />
            <Route path="creditor" element={<CreditorInvoiceBase />} />
            <Route path="dummy" element={<DummyInvoice />} />
            <Route path="all" element={<ViewAllInvoices />} />
            {/* single invoice using id */}
            <Route path="cash/:id" element={<SingleInvoice />} />
          </Route>

          <Route path="vehicle">
            <Route path="model" element={<VehicleModel />} />
            <Route path="part" element={<SpareParts />} />
          </Route>

          {/* Creditor Routes */}
          <Route path="creditors">
            <Route path="register" element={<RegisterCreditor />} />
            <Route path="manage" element={<CreditorManagement />} />
            <Route path="manage/:id" element={<ViewCreditor />} />
          </Route>

          <Route path="reports">
            <Route path="daily-sales" element={<DailySalesBase />} />
          </Route>

          {/* Routes for user management */}
          <Route path="users">
            <Route path="list" element={<ViewUsers />} />
            <Route path="register" element={<RegisterUser />} />
            <Route path="edit" element={<EditUser />} />
          </Route>

          <Route path="log">
            <Route path="activity" element={<ActivityLog />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
