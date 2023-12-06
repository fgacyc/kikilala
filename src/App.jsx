import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Submit from "./pages/formPage/submit.jsx";
import "@arco-design/web-react/dist/css/arco.css";
import CGLsManagement from "./pages/adminPage/CGLsManagement.jsx";
import AttendanceManagement from './pages/AttendancePage/AttendanceManagement';
import CGLAttendance from './pages/CGLAttendance/CGLAttendance';
import HeadCount from "./pages/headCount/headCount.jsx";
import HeadCountManagement from "./pages/headCount/headcountManagement.jsx";
import AdminMenu from "./pages/adminMenu/adminMenu.jsx";
import UserManagement from "./pages/userManagement/userManagement.jsx";
import Header from "./pages/Header/Header.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import {useEffect} from "react";
import {isAdmin} from "./tools.js";



function App() {
    const { loginWithRedirect, user, isLoading } = useAuth0();
    const currentUrl = window.location.pathname;
    const adminUrls = [
        "/nb-admin",
        "/nb-user",
        "/nb-attendance",
        "/nb-headcount",
        "/submit",
    ]

    useEffect(() => {
        if (isLoading) return;
        if(!adminUrls.includes(currentUrl)) return;

        // haven't login, redirect to login page
        if (!user) {
            loginWithRedirect();
        }

        // login, but not admin, redirect to first page
        isAdmin(user).then((res) => {
            if (!res){
                alert("You are not admin, please contact Phoebe to get access.");
                window.location.href = "/";
            }
        });
    }, [isLoading]);

    // 1. if try to access admin page
    // 2. check if user is admin
    // 3. if not, redirect to login page
    // 4. if yes, show admin page

    return (
        <>
            {
                currentUrl !== "/submit" &&
                adminUrls.includes(currentUrl) ? <Header /> : <></>
            }
            <Router>
                <Routes>
                    {/*<Route path="/login" element={<Login/>}/>*/}
                    <Route path="/" element={<Submit />} />
                    <Route path="/submit" element={<Submit />} />
                    <Route path="history/:cg_name" element={<CGLAttendance />} />
                    <Route path="headcount" element={<HeadCount />} />
                    <Route path="admin" element={<AdminMenu />} />
                    <Route path="nb-admin" element={<CGLsManagement />} />
                    <Route path="nb-user" element={<UserManagement />} />
                    <Route path="nb-attendance" element={<AttendanceManagement />} />
                    <Route path="nb-headcount" element={<HeadCountManagement />} />
                </Routes>
            </Router>
        </>

    )
}

export default App
