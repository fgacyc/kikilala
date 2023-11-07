import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Submit from "./pages/formPage/submit.jsx";
import "@arco-design/web-react/dist/css/arco.css";
import CGLsManagement from "./pages/adminPage/CGLsManagement.jsx";
import AttendanceManagement from './pages/AttendancePage/AttendanceManagement';
import CGLAttendance from './pages/CGLAttendance/CGLAttendance';
import HeadCount from "./pages/headCount/headCount.jsx";
import HeadCountManagement from "./pages/headCount/headcountManagement.jsx";
function App() {
    return (
        <Router>
            <Routes>
                {/*<Route path="/login" element={<Login/>}/>*/}
                <Route path="/" element={<Submit />} />
                <Route path="history/:cg_name" element={<CGLAttendance />} />
                <Route path="/headcount" element={<HeadCount />} />
                <Route path="admin" element={<CGLsManagement />} />
                <Route path="nb-admin" element={<CGLsManagement />} />
                <Route path="nb-attendance" element={<AttendanceManagement />} />
                <Route path="nb-headcount" element={<HeadCountManagement />} />
            </Routes>
        </Router>
    )
}

export default App
