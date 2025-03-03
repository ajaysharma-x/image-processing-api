import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import RequestStatus from './components/RequestStatus'
import ExportCSV from './components/ExportCSV'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/request-status" element={<RequestStatus />} />
        <Route path="/export-csv" element={<ExportCSV />} />
      </Routes>
    </Router>
  )
}

export default App
