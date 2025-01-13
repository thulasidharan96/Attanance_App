// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-indigo-700 text-white p-2 mt-3">
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} AttenApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
