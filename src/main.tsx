import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home.tsx'
import MyProfile from './pages/MyProfile.tsx'
import Promotion from './pages/Promotion.tsx';
import Organization from './pages/Organization.tsx';
import Login from './pages/Login.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <div className="flex">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/myprofile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/promotion" element={<PrivateRoute><Promotion /></PrivateRoute>} />
            <Route path="/organization" element={<PrivateRoute><Organization /></PrivateRoute>} />
          </Routes>
      </div>
    </Router>
  </StrictMode>
)
