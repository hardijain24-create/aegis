import React from 'react';
import { motion, useScroll } from 'framer-motion';
import Hero from './components/Hero.jsx';
import ProductsSection from './components/ProductsSection.jsx';
import NetworkMorph from './components/NetworkMorph.jsx';
import AboutSection from './components/AboutSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import CursorFollower from './components/CursorFollower.jsx';

export default function App() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="relative bg-[#F2F0EB] text-[#11110F] font-sans antialiased overflow-x-hidden w-full min-h-screen">
      
      {/* 1. Global Custom Spring Cursor Follower (Desktop Only) */}
      <CursorFollower />

      {/* 2. Global Fixed Scroll Progress indicator Bar */}
      <motion.div 
        style={{
          scaleX: scrollYProgress,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2.5px',
          backgroundColor: '#111111',
          transformOrigin: '0%',
          zIndex: 100,
          pointerEvents: 'none'
        }}
      />

      <main className="relative z-10">
        {/* Hero section left untouched as requested */}
        <Hero />
        
        {/* Animated content sections */}
        <ProductsSection />
        <NetworkMorph />
        <AboutSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}
