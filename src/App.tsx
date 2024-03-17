import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Keycloak from "./components/auth/Keycloak";
import Error500 from "./pages/error/500";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <Routes>
      {/* secured routes  */}
      <Route path="/" element={<Keycloak />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

      {/* error pages */}
      <Route path="/error/500" element={<Error500 />} />
    </Routes>
  );
}

export default App;
