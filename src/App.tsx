import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Keycloak from "./components/auth/Keycloak";
import Error500 from "./pages/error/500";
import Dashboard from "./pages/dashboard/Dashboard";
import RegisterCreditor from "./pages/dashboard/creditors/Register-creditor";

function App() {
  return (
    <Routes>
      {/* error pages */}
      <Route path="error/500" element={<Error500 />} />

      {/* secured routes  */}
      <Route path="/" element={<Keycloak />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} >
        <Route path="/dashboard/creditors/register" element={<RegisterCreditor />} />
        </Route>
      </Route>
    </Routes>
  
  );
}

export default App;
