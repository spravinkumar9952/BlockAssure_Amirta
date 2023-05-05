import Navbar from "./Components/Navbar";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "./Pages/Home";
import './style.scss';
import InsuranceHome from "./Pages/InsuranceHome";
import CreateInsurance from "./Pages/CreateInsurance";
import VerifyPolicy from "./Pages/VerifyPolicy";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/insuranceHome" element={<InsuranceHome />} />
                    <Route path="/createInsurance" element={<CreateInsurance />} />
                    <Route path="/verifyPolicy" element={<VerifyPolicy />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
