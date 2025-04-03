import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home.tsx'
import MyProfile from './components/MyProfile.tsx'
import Promotion from './components/Promotion.tsx';
import Organization from './components/Organization.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <div className="flex">
       
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/promotion" element={<Promotion />} />
            <Route path="/organization" element={<Organization />} />
          </Routes>
        
      </div>
    </Router>
  </StrictMode>
)
