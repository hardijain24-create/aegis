import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { animate, scrambleText } from 'animejs';
import './Hero.css';

export default function Hero() {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const audioCtxRef = useRef(null);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const soundEnabledRef = useRef(false);

  // Sync ref with sound toggle state
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Scroll tracking for transition parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Content exit transforms on scroll
  const footerY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const footerOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const footerScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  // Heading scroll-based transformations (Double-parallax)
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const headingScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  // Video exit transforms
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const customEase = [0.16, 1, 0.3, 1];

  // Tick sound oscillator player
  const playTickSound = () => {
    if (!soundEnabledRef.current || !audioCtxRef.current) return;
    try {
      const audioCtx = audioCtxRef.current;
      const t = audioCtx.currentTime;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(4000 + Math.random() * 400, t);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.035, t + 0.001);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.003);
      o.connect(g).connect(audioCtx.destination);
      o.start(t);
      o.stop(t + 0.003);
    } catch (e) {
      console.warn("Audio feedback error:", e);
    }
  };

  // Sound click toggle handler
  const handleToggleSound = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setSoundEnabled(prev => !prev);
  };

  // Run AnimeJS text scramble effect on load
  useEffect(() => {
    if (!headingRef.current) return;
    const anim = animate(headingRef.current, {
      innerHTML: scrambleText({ 
        onChange: playTickSound 
      }),
      duration: 40000, // Extremely slow 40-second scramble duration for readability
      loop: true,
      loopDelay: 2000,
    });    return () => {
      anim.pause();
    };
  }, []); // Run once on mount

  return (
    <section ref={containerRef} className="aegis-hero">
      
      {/* Navbar Fixed Top */}
      <motion.nav 
        className="hero-nav"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: customEase }}
      >
        {/* Left Elements */}
        <div className="hero-nav-left">
          <a href="/" className="nav-logo-link">
            {/* Custom SVG logo: two rotated rectangles at -35deg */}
            <svg className="nav-logo-icon" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="6" width="16" height="3.5" rx="1.75" fill="black" />
              <rect x="4" y="14.5" width="16" height="3.5" rx="1.75" fill="black" />
            </svg>
            <span className="nav-logo-text" style={{ fontSize: '28px', fontWeight: 500, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>AEGIS</span>
          </a>

          {/* Menu Button Pill with Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className="nav-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="circle-plus-wrapper">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </span>
              <span className="nav-menu-text">Menu</span>
            </button>

            {isMenuOpen && (
              <div className="menu-dropdown" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(17,17,17,0.15)',
                borderRadius: '8px',
                padding: '8px 0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                zIndex: 60,
                minWidth: '140px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <a href="#products" onClick={() => setIsMenuOpen(false)} style={{
                  padding: '8px 20px',
                  color: '#111111',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  textAlign: 'left'
                }}>Products</a>
                <a href="#about" onClick={() => setIsMenuOpen(false)} style={{
                  padding: '8px 20px',
                  color: '#111111',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  textAlign: 'left'
                }}>About</a>
                <a href="#contact" onClick={() => setIsMenuOpen(false)} style={{
                  padding: '8px 20px',
                  color: '#111111',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  textAlign: 'left'
                }}>Inquiries</a>
              </div>
            )}
          </div>
        </div>

        {/* Right Elements (Sound Controller Toggle) */}
        <div className="hero-nav-right" style={{ display: 'flex' }}>
          <button 
            onClick={handleToggleSound}
            className="footer-btn-outline"
            style={{
              padding: '6px 14px',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '999px',
              backgroundColor: soundEnabled ? '#111111' : 'transparent',
              color: soundEnabled ? '#ffffff' : '#111111',
              border: '1px solid rgba(17, 17, 17, 0.25)',
              cursor: 'pointer'
            }}
          >
            {soundEnabled ? 'Sound ON' : 'Sound OFF'}
          </button>
        </div>
      </motion.nav>

      {/* Background Video Layer */}
      <motion.div 
        className="hero-video-wrapper"
        style={{ scale: videoScale, y: videoY }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: customEase }}
      >
        <video
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
        />
      </motion.div>

      {/* Empty Center spacing */}
      <div />

      {/* Footer Content Wrapper */}
      <motion.div 
        className="hero-footer-wrapper"
        style={{ y: footerY, opacity: footerOpacity, scale: footerScale }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: customEase, delay: 0.5 }}
      >
        
        {/* Left Block */}
        <div className="footer-left-block">
          {/* Subtitle Line: AEGIS */}
          <motion.div 
            className="footer-subtitle-line"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: customEase, delay: 0.6 }}
            whileHover={{ scale: 1.03 }}
            style={{ marginBottom: '12px' }}
          >
            <div className="subtitle-dot" style={{ width: '12px', height: '12px', marginTop: '12px' }} />
            <span style={{ fontSize: '72px', fontWeight: 500, letterSpacing: '-0.02em', color: '#111111', fontFamily: 'var(--font-heading)', lineHeight: '0.85' }}>
              AEGIS
            </span>
          </motion.div>
          {/* Heading: BUILD FOR MOMENTS THAT MATTER THE MOST */}
          <div style={{ overflow: 'visible' }}>
            <motion.h1 
              ref={headingRef}
              className="footer-heading font-heading"
              style={{ y: headingY, scale: headingScale, fontFamily: 'var(--font-heading)', fontWeight: 400, paddingRight: '48px' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.8 }}
              whileHover={{ letterSpacing: '0.01em', scale: 1.01 }}
            >
              BUILD FOR MOMENTS THAT MATTER THE MOST
            </motion.h1>
          </div>

          {/* Buttons */}
          <motion.div 
            className="footer-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: customEase, delay: 1.0 }}
          >
            <a href="#products" className="footer-btn-pill">
              Explore AEGIS
            </a>
            <a href="#about" className="footer-btn-outline">
              How It Works
            </a>
          </motion.div>
        </div>

      </motion.div>

    </section>
  );
}
