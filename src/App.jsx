import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LauUdMefy from './components/LaUdMefy.jsx'
import LandingPage from './components/LandingPage.jsx'
import Loading from './components/Loading.jsx'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/checker" element={<LauUdMefy />} />
      </Routes>
    </Router>
  )
}

export default App
