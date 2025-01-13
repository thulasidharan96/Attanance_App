// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-indigo-700 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-3xl font-bold">AttenApp</Link>
        </div>
        <nav className="space-x-4">
          <Link to="/" className="hover:text-indigo-300">Home</Link>
          <Link to="/register" className="hover:text-indigo-300">Register</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
