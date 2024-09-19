import PrintCreditor from "@/pages/dashboard/invoice/creditor/Print.tsx";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Keycloak from "./components/auth/Keycloak";
import Dashboard from "./pages/dashboard/Dashboard";
import ChequeManagement from "./pages/dashboard/cheque/ChequeManagement";
import { AddTransaction } from "./pages/dashboard/creditors/AddTransaction";
import CreditorManagement from "./pages/dashboard/creditors/CreditorManagement";
import RegisterCreditor from "./pages/dashboard/creditors/RegisterCreditor";
import ViewCreditor from "./pages/dashboard/creditors/ViewCreditor";
import { MainDashboard } from "./pages/dashboard/dashboard-main/MainDashboard";
import { Analytics } from "./pages/dashboard/dashboard-root/Analytics";
import CashInvoice from "./pages/dashboard/invoice/cash/CashInvoice";
import CreditorInvoiceBase from "./pages/dashboard/invoice/creditor/CreditorInvoiceBase";
import DummyInvoice from "./pages/dashboard/invoice/dummy/DummyInvoice";
import { ViewAllInvoices } from "./pages/dashboard/invoice/view-invoices/ViewAllInvoices";
import SingleInvoice from "./pages/dashboard/invoice/view/SingleInvoice";
import DailySalesBase from "./pages/dashboard/reports/daily-sales-expenses/DailySalesBase";
import EditUser from "./pages/dashboard/user-management/EditUser";
import RegisterUser from "./pages/dashboard/user-management/RegisterUser";
import ViewUsers from "./pages/dashboard/user-management/view-user/ViewUsers";
import Error500 from "./pages/error/500";
import ActivityLog from "./pages/log/ActivityLog";
import SpareParts from "./pages/sparePart/SpareParts";
import VehicleModel from "./pages/sparePart/VehicleModel";
import SingleInvoiceCredit from "./pages/dashboard/invoice/view/SingleInvoiceCredit";

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
          <Route path="home" element={<MainDashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="invoice">
            <Route path="cash" element={<CashInvoice />} />
            <Route path="creditor" element={<CreditorInvoiceBase />} />
            <Route path="dummy" element={<DummyInvoice />} />
            <Route path="all" element={<ViewAllInvoices />} />
            <Route path="cash/:id" element={<SingleInvoice />} />
            <Route path="creditor/:id" element={<SingleInvoiceCredit />} />
            <Route path="creditor/print" element={<PrintCreditor />} />
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
            <Route path="transaction" element={<AddTransaction />} />
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

          <Route path="cheque" element={<ChequeManagement />} />

          <Route path="log">
            <Route path="activity" element={<ActivityLog />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
