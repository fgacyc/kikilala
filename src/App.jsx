import {useState} from 'react'
import './App.css'
import {readAllCGLs} from "./api/CGLs.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Submit from "./components/submit.jsx";
import "@arco-design/web-react/dist/css/arco.css";


function App() {
    return (
        <Router>
            <Routes>
                {/*<Route path="/login" element={<Login/>}/>*/}
                <Route path="/" element={<Submit/>}/>
            </Routes>
        </Router>
    )
}

export default App
