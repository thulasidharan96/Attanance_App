import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-cyan-950 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-3xl font-bold tracking-wide hover:text-indigo-300 transition-all duration-200"
          >
            AttenApp
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-lg font-medium hover:text-indigo-300 transition-all duration-200"
          >
            Home
          </Link>
          <Link
            to="/register"
            className="text-lg font-medium hover:text-indigo-300 transition-all duration-200"
          >
            Register
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none p-2 rounded-lg transition hover:bg-cyan-800"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation with Smooth Animation */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 min-h-screen ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-cyan-900 shadow-lg transform transition-transform duration-300 p-6 rounded-l-2xl min-h-screen ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{zIndex:9999}}
      >
        {/* Close Button Inside Menu */}
        <button
          className="absolute top-4 right-4 text-white focus:outline-none"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={28} />
        </button>

        {/* Mobile Navigation Links */}
        <nav className="flex flex-col space-y-6 mt-12">
          <Link
            to="/"
            className="text-lg font-medium hover:text-indigo-300 transition-all duration-200 p-2 rounded-lg hover:bg-cyan-800"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/register"
            className="text-lg font-medium hover:text-indigo-300 transition-all duration-200 p-2 rounded-lg hover:bg-cyan-800"
            onClick={() => setMenuOpen(false)}
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
