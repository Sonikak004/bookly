import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CalendarView from './pages/CalendarView'
import Appointments from './pages/Appointments'
import Customers from './pages/Customers'
import Services from './pages/Services'
import Staff from './pages/Staff'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="customers" element={<Customers />} />
        <Route path="services" element={<Services />} />
        <Route path="staff" element={<Staff />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
