import React, { useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from './components/Hero.jsx';
import ProductsSection from './components/ProductsSection.jsx';
import NetworkMorph from './components/NetworkMorph.jsx';
import AboutSection from './components/AboutSection.jsx';
import CinematicVideoSection from './components/CinematicVideoSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import CursorFollower from './components/CursorFollower.jsx';

// Register GSAP ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // 1. Check user reduced-motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQuery.matches) {
      // If reduced motion is enabled, skip smooth scrolling
      return;
    }

    // 2. Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // 3. Connect Lenis scroll updates to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 4. Sync Lenis animation updates with the GSAP Ticker
    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // 5. Trigger a layout refresh once page loads
    const loadTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    // 6. Cleanup listeners and tickers on component unmount
    return () => {
      clearTimeout(loadTimeout);
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  return (
    <div className="relative bg-[#F2F0EB] text-[#11110F] font-sans antialiased overflow-x-hidden w-full min-h-screen">
      
      {/* Global Custom Spring Cursor Follower (Desktop Only) */}
      <CursorFollower />

      {/* Global Fixed Scroll Progress indicator Bar */}
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
        <CinematicVideoSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}
