import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
