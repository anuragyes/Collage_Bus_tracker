import React from 'react'
import Register from './pages/Register'
import BusComponent from './pages/Buscomponent'
import Work from './pages/Work'
import Tracker from './pages/Tracker'
import Parent from './pages/Parent'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavbarContent from './pages/NavbarContent'
import DriverProfilePage from './pages/DriverProfilePage'
import BusMap from './pages/BusMap'
 import StudentMapDashboard from './pages/StudentMapDashboard'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavbarContent />} />
          <Route path='/register' element={<Register />} />
          <Route path="/DriverTracker" element={<BusMap />} />
          <Route path="/StudentTracker" element={<StudentMapDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App


