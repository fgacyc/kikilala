import { useState } from 'react'
import './App.css'
import { readAllCGLs } from "./api/CGLs.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Submit from "./pages/formPage/submit.jsx";
import "@arco-design/web-react/dist/css/arco.css";
import CGLsManagement from "./pages/adminPage/CGLsManagement.jsx";
import DataCharts from "./pages/DataCharts/DataCharts.jsx";
import AttendanceManagement from './pages/AttendancePage/AttendanceManagement';
import CGLAttendance from './pages/CGLAttendance/CGLAttendance';


function App() {
    return (
        <Router>
            <Routes>
                {/*<Route path="/login" element={<Login/>}/>*/}
                <Route path="/" element={<Submit />} />
                <Route path="history/:cg_name" element={<CGLAttendance />} />
                <Route path="nb-admin" element={<CGLsManagement />} />
                <Route path="nb-attendance" element={<AttendanceManagement />} />
            </Routes>
        </Router>
    )
}

export default App
