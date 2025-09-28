import React from 'react'
import Register from './pages/Register'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavbarContent from './pages/NavbarContent'
import DriverProfilePage from './pages/DriverProfilePage'
import BusMap from './pages/BusMap'
 import StudentMapDashboard from './pages/StudentMapDashboard'
import StudentAccessPage from './pages/StudentAccessProfile'
import DriverAccessPage from './pages/DriverAccessProfile'
import TestimonialGrid from './pages/TestimonialGrid'
import Footer from './pages/Footer'
import BusComponent from './pages/Buscomponent'
import { Navbar } from './pages/Navbar'
import Work from './pages/Work'
import Parent from './pages/Parent'

const App = () => {
  return (
    <>
      <BrowserRouter>
      <Navbar/>

       <Routes>
          <Route path="/" element={<NavbarContent />} />
          <Route path='/register' element={<Register />} />
          <Route path="/dashboard" element={<BusMap />} />
          <Route path="/BusComponent" element={<BusComponent/>} />
          <Route path="/Work" element={<Work/>} />
            <Route path="/Parent" element={<Parent/>}/>
          <Route path="/student-dashboard" element={<StudentMapDashboard/>}/>
          <Route path="/studentaccess" element={<StudentAccessPage/>}/>
          <Route path="/driveraccess" element={<DriverAccessPage/>}/>
          <Route path="/Testimonials" element={<TestimonialGrid/>}/>
        </Routes>
      <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App




