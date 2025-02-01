// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-cyan-950 text-white p-4 flex">
  <div className="max-w-7xl mx-auto text-center">
    <p className="text-sm font-light">
      &copy; {new Date().getFullYear()} AttenApp. All rights reserved.
    </p>
    <p className="text-xs mt-2 opacity-75">Designed with ❤️ by Your Team</p>
  </div>
</footer>
  );
};

export default Footer;
