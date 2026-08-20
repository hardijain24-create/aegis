import React, { useRef, useState, useEffect } from 'react';
import { animate, scrambleText } from 'animejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

export default function Hero() {
  const containerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const audioCtxRef = useRef(null);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const soundEnabledRef = useRef(false);

  // Sync ref with sound toggle state
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

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

  // 1. AnimeJS text scramble effect on individual lines
  useEffect(() => {
    if (!line1Ref.current || !line2Ref.current) return;

    const anim1 = animate(line1Ref.current, {
      innerHTML: scrambleText({ onChange: playTickSound }),
      duration: 30000,
      loop: true,
      loopDelay: 3000,
    });

    const anim2 = animate(line2Ref.current, {
      innerHTML: scrambleText({ onChange: playTickSound }),
      duration: 30000,
      loop: true,
      loopDelay: 3000,
    });

    return () => {
      anim1.pause();
      anim2.pause();
    };
  }, []);

  // 2. GSAP Entry reveals & ScrollTrigger parallax exits
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Keep the Hero light at rest and keep hyperspace entirely inactive until the scroll transition begins.
      gsap.set(".hero-video-wrapper", { opacity: 1, scale: 1, x: 0, y: 0, filter: "none" });
      gsap.set(".hero-nav", { opacity: 1, y: 0 });
      gsap.set(".footer-subtitle-line", { opacity: 1, y: 0 });
      gsap.set(".headline-line", { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" });
      gsap.set(".footer-actions", { opacity: 1, y: 0 });
      gsap.set(".hero-footer-wrapper", { opacity: 1, scale: 1, filter: "none" });
      gsap.set(".hyperspace-burst", { opacity: 0, visibility: "hidden" });
      
      // Ensure burst elements start completely hidden
      gsap.set(".burst-glow, .burst-layer, .burst-streaks, .burst-chromatic", { opacity: 0, scale: 1, rotation: 0, x: 0, y: 0, filter: "none" });

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Scroll-scrubbed hyperspace handoff from Hero into Products.
      // Increased scroll distance (+=1100 vs +=900) for 20-30% slower pacing
      const hyperspaceTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1100",
          pin: !prefersReducedMotion,
          scrub: prefersReducedMotion ? false : 1.0,
          invalidateOnRefresh: true,
          pinSpacing: !prefersReducedMotion
        }
      });

      if (prefersReducedMotion) {
        gsap.set(".products-first-card", { clearProps: "all" });
        return;
      }

      // PHASE 1 (0-12%): Calm Hero state - subtle charge
      hyperspaceTl
        .to(".hyperspace-burst", { opacity: 0, visibility: "hidden", ease: "none" }, 0)
        .to(".hero-video-wrapper", { opacity: 1, ease: "power1.out" }, 0)
        .to(".hero-footer-wrapper", { scale: 1, filter: "none", ease: "power1.out" }, 0)
        .to(".hero-video-wrapper", { scale: 1.03, filter: "saturate(0.85) brightness(1.01)", ease: "power1.out" }, 0)
        
        // PHASE 2 (12-28%): Charge state - building pressure
        .to(".hyperspace-burst", { opacity: 0.12, visibility: "visible", ease: "power2.out" }, 0.18)
        .to(".burst-glow", { opacity: 0.2, scale: 1.08, ease: "power2.out" }, 0.18)
        .to(".hero-footer-wrapper", { scale: 0.98, filter: "saturate(0.8) brightness(1)", ease: "power1.inOut" }, 0.18)
        
        // PHASE 3 (28-42%): Pre-warp - gradual acceleration begins
        .to(".burst-layer", { opacity: 0.3, scale: 1.1, filter: "blur(6px)", ease: "power3.in" }, 0.32)
        .to(".burst-streaks", { opacity: 0.4, scale: 1.12, rotation: 4, filter: "blur(0.5px)", ease: "power2.in" }, 0.32)
        
        // PHASE 4 (42-65%): Hyperspace acceleration - main burst
        .to(".hero-footer-wrapper", { scale: 1.6, opacity: 0.2, filter: "blur(12px) saturate(0.4)", ease: "power3.in" }, 0.45)
        .to(".hero-video-wrapper", { scale: 1.25, yPercent: -6, filter: "blur(5px) saturate(0.45) brightness(0.92)", ease: "power2.inOut" }, 0.48)
        .to(".burst-layer", { opacity: 0.85, scale: 1.3, filter: "blur(14px)", ease: "power4.in" }, 0.45)
        .to(".burst-streaks", { opacity: 0.9, scale: 1.3, rotation: 10, filter: "blur(1px)", ease: "power3.in" }, 0.45)
        .to(".hyperspace-viewport", {
          keyframes: [{ x: 2.5, y: -1.5 }, { x: -2.5, y: 1.5 }, { x: 1.5, y: -1 }, { x: 0, y: 0 }],
          ease: "none"
        }, 0.48)
        .to(".burst-chromatic", { opacity: 0.65, x: 1.5, filter: "blur(1px)", ease: "power2.out" }, 0.50)
        
        // PHASE 5 (65-75%): Peak / maximum speed
        .to(".burst-layer", { scale: 1.35, opacity: 0.9, ease: "power1.out" }, 0.60)
        .to(".burst-streaks", { scale: 1.35, opacity: 0.95, ease: "power1.out" }, 0.60)
        
        // PHASE 6 (75-88%): System fold / deceleration
        .to(".burst-layer", { scale: 0.5, opacity: 0.25, filter: "blur(6px)", ease: "power2.in" }, 0.70)
        .to(".burst-streaks", { scale: 0.45, opacity: 0.2, rotation: -8, ease: "power2.in" }, 0.70)
        .to(".burst-chromatic", { opacity: 0.25, x: 0, filter: "blur(0px)", ease: "power2.in" }, 0.70)
        .to(".burst-glow", { opacity: 0.1, scale: 0.7, ease: "power2.in" }, 0.70)
        
        // PHASE 7 (88-100%): Product emergence and arrival
        .fromTo(".products-first-card",
          { scale: 1.06, opacity: 0, filter: "blur(6px)" },
          { scale: 1, opacity: 1, filter: "blur(0px)", ease: "back.out(1.4)" },
          0.78
        )
        .to(".burst-layer", { opacity: 0, ease: "power1.in" }, 0.85)
        .to(".burst-streaks", { opacity: 0, ease: "power1.in" }, 0.85)
        .to(".burst-glow", { opacity: 0, ease: "power1.in" }, 0.85)
        .to(".burst-chromatic", { opacity: 0, ease: "power1.in" }, 0.85)
        
        // Reveal product text in sequence
        .fromTo(".products-first-card .label, .products-first-card .title, .products-first-card .description, .products-first-card .cta",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, stagger: 0.04, ease: "power3.out" },
          0.82
        );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3. Desktop cursor-tracking parallax using GSAP quickTo
  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const xTo = gsap.quickTo(".hero-video-wrapper", "x", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(".hero-video-wrapper", "y", { duration: 0.8, ease: "power3.out" });

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = (e.clientX / innerWidth) - 0.5; // [-0.5, 0.5]
      const yPercent = (e.clientY / innerHeight) - 0.5; // [-0.5, 0.5]
      
      // Limit CRT character offsets to max x: 8px, y: 5px
      xTo(xPercent * 16);
      yTo(yPercent * 10);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="aegis-hero hyperspace-viewport">
      
      {/* Navbar Fixed Top */}
      <nav className="hero-nav" style={{ transform: 'none' }}>
        {/* Left Elements */}
        <div className="hero-nav-left">
          <a href="/" className="nav-logo-link">
            {/* Custom SVG logo */}
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
      </nav>

      {/* Background Video Layer */}
      <div className="hero-video-wrapper">
        <video
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
        />
      </div>

      <div className="hyperspace-burst" aria-hidden="true">
        <div className="burst-glow" />
        <div className="burst-layer" />
        <div className="burst-streaks" />
        <div className="burst-chromatic" />
      </div>

      {/* Hero Content Layer - Flexbox expansion to fill viewport */}
      <div className="hero-content-spacer" />

      {/* Footer Content Wrapper - Enhanced composition */}
      <div className="hero-footer-wrapper">
        
        {/* Left Block */}
        <div className="footer-left-block">
          {/* Subtitle Line: AEGIS */}
          <div className="footer-subtitle-line" style={{ marginBottom: '12px' }}>
            <div className="subtitle-dot" style={{ width: '12px', height: '12px', marginTop: '12px' }} />
            <span style={{ fontSize: '72px', fontWeight: 500, letterSpacing: '-0.02em', color: '#111111', fontFamily: 'var(--font-heading)', lineHeight: '0.85' }}>
              AEGIS
            </span>
          </div>
          
          {/* Heading: BUILD FOR MOMENTS THAT MATTER */}
          <div style={{ overflow: 'visible' }}>
            <h1 
              className="footer-heading font-heading"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, paddingRight: '48px', marginBottom: '8px' }}
            >
              <div style={{ overflow: 'hidden', paddingBottom: '6px' }}>
                <span ref={line1Ref} className="headline-line inline-block">BUILD FOR MOMENTS</span>
              </div>
              <div style={{ overflow: 'hidden', paddingBottom: '6px' }}>
                <span ref={line2Ref} className="headline-line inline-block">THAT MATTER.</span>
              </div>
            </h1>
          </div>

          {/* Buttons */}
          <div className="footer-actions">
            <a href="#products" className="footer-btn-pill">
              Explore AEGIS
            </a>
            <a href="#about" className="footer-btn-outline">
              How It Works
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}
