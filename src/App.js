import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import RegisterPage from './Pages/Registerpage';
import DashBoard from './Pages/DashBoard';
import MissingPage from './Pages/MissingPage';
import AdminDashboard from './Pages/AdminDashboard';
import InstallPWA from './component/InstallPWA';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/dashboard' element={<DashBoard />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='*' element={<MissingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
