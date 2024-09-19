import React from 'react'
import Home from './pages/Home'
import Verify from "./pages/Verify";
import Admin from './pages/Admin';

import {Routes, Route , useLocation} from "react-router-dom"

export default function BlockRoutes({certificateVerifier }) {
  return (
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/verify" element={<Verify/>}/>
        <Route path="/admin" element={<Admin/>} certificateVerifier={certificateVerifier} />
    </Routes>
  )
}
