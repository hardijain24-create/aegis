import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.header 
        className="aegis-nav"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo (left) */}
        <a href="/" className="aegis-nav-logo">
          AEGIS&reg;
          <span style={{ fontSize: '28px', lineHeight: 1 }}>&#10033;</span>
        </a>

        {/* Desktop Links (right) */}
        <nav className="aegis-nav-links">
          <a href="#products" className="aegis-nav-link">Products</a>
          <a href="#about" className="aegis-nav-link">About</a>
          <a href="#contact" className="aegis-nav-link">Contact</a>
        </nav>

        {/* Mobile menu trigger button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="aegis-mobile-menu-btn"
          aria-label="Toggle Navigation"
          style={{ display: isOpen ? 'flex' : undefined }}
        >
          <span style={isOpen ? { transform: 'rotate(45deg) translateY(4px)' } : {}} />
          <span style={isOpen ? { opacity: 0 } : {}} />
          <span style={isOpen ? { transform: 'rotate(-45deg) translateY(-4px)' } : {}} />
        </button>
      </motion.header>

      {/* Mobile Navigation Sheet */}
      <div 
        className={`fixed inset-0 z-40 bg-[#E9E8E4]/95 backdrop-blur-sm flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-6 text-left">
          <a href="#products" onClick={() => setIsOpen(false)} className="text-[32px] font-medium text-[#11110F] hover:opacity-60 transition-opacity">Products</a>
          <a href="#about" onClick={() => setIsOpen(false)} className="text-[32px] font-medium text-[#11110F] hover:opacity-60 transition-opacity">About</a>
          <a href="#contact" onClick={() => setIsOpen(false)} className="text-[32px] font-medium text-[#11110F] hover:opacity-60 transition-opacity">Contact</a>
        </nav>
      </div>
    </>
  );
}
