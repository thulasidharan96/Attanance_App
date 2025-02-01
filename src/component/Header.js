// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-cyan-950 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-3xl font-bold tracking-wide hover:text-indigo-300 transition-all duration-200">AttenApp</Link>
        </div>
        <nav className="space-x-6">
          <Link to="/" className="text-lg font-medium hover:text-indigo-300 transition-all duration-200">Home</Link>
          <Link to="/register" className="text-lg font-medium hover:text-indigo-300 transition-all duration-200">Register</Link>
        </nav>
      </div>
    </header>
  );  
};

export default Header;
