import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateRFP from "./pages/CreateRFP";
import RFPList from "./pages/RFPList";
import Vendors from "./pages/Vendors";
import Proposals from "./pages/Proposals";

function App() {
  return (
    <div className="app-shell">
      <BrowserRouter>
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/" element={<CreateRFP />} />
            <Route path="/rfps" element={<RFPList />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/proposals" element={<Proposals />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
