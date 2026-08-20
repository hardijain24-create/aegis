import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

export default function NetworkMorph() {
  const containerRef = useRef(null);
  const coreRef = useRef(null);
  const lineRefs = useRef([]);
  const pillRefs = useRef([]);
  const floatRefs = useRef([]);

  // State to track hover focus
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [isCoreHovered, setIsCoreHovered] = useState(false);

  // Labels structure with coordinates relative to center (250, 250) on 500x500 viewport
  const labels = [
    { text: 'ADAPTIVE TECHNOLOGY', cx: 0, cy: -180, delay: 0, floatDuration: 5.5, parallaxMax: 20 },
    { text: 'HUMAN-CENTERED DESIGN', cx: -180, cy: -110, delay: 0.1, floatDuration: 6.0, parallaxMax: 15 },
    { text: 'CONNECTED HARDWARE', cx: 180, cy: -120, delay: 0.2, floatDuration: 6.5, parallaxMax: 16 },
    { text: 'PERSONAL SAFETY', cx: -220, cy: 0, delay: 0.3, floatDuration: 7.0, parallaxMax: 20 },
    { text: 'REAL-TIME RESPONSE', cx: 220, cy: -10, delay: 0.4, floatDuration: 5.8, parallaxMax: 18 },
    { text: 'HEALTHCARE SYSTEMS', cx: -160, cy: 130, delay: 0.5, floatDuration: 6.2, parallaxMax: 14 },
    { text: 'INTELLIGENT SOFTWARE', cx: 170, cy: 110, delay: 0.6, floatDuration: 6.8, parallaxMax: 17 },
    { text: 'SECURE BY DESIGN', cx: 0, cy: 190, delay: 0.7, floatDuration: 7.2, parallaxMax: 13 }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // Desktop Pinned Activation (min-width: 1024px)
      mm.add("(min-width: 1024px)", () => {
        
        // Main timeline for the pinned system activation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=1200",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        // Step 1: Central Core emerges
        tl.fromTo(coreRef.current,
          { scale: 0.85, opacity: 0, y: 30, filter: 'blur(4px)' },
          { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: "power3.out" }
        );

        // Step 2: Draw connections and fade in capability pills (staggered)
        labels.forEach((lbl, idx) => {
          const line = lineRefs.current[idx];
          const pill = pillRefs.current[idx];
          const len = Math.hypot(lbl.cx, lbl.cy);

          if (line && pill) {
            tl.fromTo(line,
              { strokeDashoffset: len },
              { strokeDashoffset: 0, duration: 0.8, ease: "none" },
              `core+=${idx * 0.1}`
            );
            tl.fromTo(pill,
              { opacity: 0, scale: 0.85, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" },
              `core+=${idx * 0.1}`
            );
          }
        });

        // Step 3: Subtle parallax offset
        tl.to(coreRef.current, { y: -10, ease: "none" }, "parallax");
        labels.forEach((lbl, idx) => {
          const pill = pillRefs.current[idx];
          if (pill) {
            const yParallax = (lbl.cy / 190) * 20; // offset based on vertical position
            tl.to(pill, { y: yParallax, ease: "none" }, "parallax");
          }
        });
      });

      // Tablet / Mobile: Simple unpinned entry reveals (max-width: 1023px)
      mm.add("(max-width: 1023px)", () => {
        // Fade in Core
        gsap.fromTo(coreRef.current,
          { opacity: 0, scale: 0.85 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: coreRef.current,
              start: "top 85%"
            }
          }
        );

        // Fade in connections and pills sequentially
        labels.forEach((lbl, idx) => {
          const line = lineRefs.current[idx];
          const pill = pillRefs.current[idx];
          const len = Math.hypot(lbl.cx, lbl.cy);

          if (line && pill) {
            gsap.fromTo(line,
              { strokeDashoffset: len },
              {
                strokeDashoffset: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: pill,
                  start: "top 90%"
                }
              }
            );

            gsap.fromTo(pill,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: pill,
                  start: "top 90%"
                }
              }
            );
          }
        });
      });

      // Ambient floating motions on the inner containers
      floatRefs.current.forEach((floatEl, idx) => {
        if (floatEl) {
          const lbl = labels[idx];
          gsap.to(floatEl, {
            y: -3,
            duration: lbl.floatDuration,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Desktop mouse parallax tracking
  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = (e.clientX / innerWidth) - 0.5; // [-0.5, 0.5]
      const yPercent = (e.clientY / innerHeight) - 0.5; // [-0.5, 0.5]

      // Shift the central object subtly (2-4px)
      gsap.to(coreRef.current, {
        x: xPercent * 6,
        y: yPercent * 6,
        duration: 0.8,
        overwrite: "auto",
        ease: "power2.out"
      });

      // Shift surrounding capability pills slightly (8-12px)
      labels.forEach((lbl, idx) => {
        const pill = pillRefs.current[idx];
        if (pill) {
          gsap.to(pill, {
            x: xPercent * lbl.parallaxMax * 0.7,
            y: yPercent * lbl.parallaxMax * 0.7,
            duration: 0.8,
            overwrite: "auto",
            ease: "power2.out"
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="w-full bg-[#E8E6E0] py-32 px-8 sm:px-12 md:px-16 border-b border-[rgba(17,17,15,0.08)] relative overflow-hidden flex flex-col items-center justify-center select-none"
      style={{ minHeight: '100vh' }}
    >
      
      {/* 1. Header tag */}
      <div className="absolute top-12 left-8 sm:left-12 md:left-16 z-20">
        <span className="text-[12px] font-mono tracking-widest text-[#6F6D68] uppercase block">
          03 / ADAPTIVE ARCHITECTURE
        </span>
      </div>

      {/* 2. Constellation Canvas Wrapper */}
      <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center">
        
        {/* SVG Connection Lines layer */}
        <svg 
          viewBox="0 0 500 500" 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ overflow: 'visible' }}
        >
          {labels.map((lbl, idx) => {
            const targetX = 250 + lbl.cx;
            const targetY = 250 + lbl.cy;
            const len = Math.hypot(lbl.cx, lbl.cy);
            const isHovered = hoveredLabel === lbl.text;
            const isAnyHovered = hoveredLabel !== null && !isHovered;

            return (
              <g key={idx}>
                <line
                  ref={el => lineRefs.current[idx] = el}
                  x1="250"
                  y1="250"
                  x2={targetX}
                  y2={targetY}
                  stroke="#111111"
                  strokeWidth={isHovered ? 1.5 : 0.75}
                  opacity={isHovered ? 0.65 : isCoreHovered ? 0.45 : isAnyHovered ? 0.12 : 0.22}
                  style={{
                    strokeDasharray: len,
                    strokeDashoffset: len,
                    transition: "stroke-width 0.25s ease, opacity 0.25s ease"
                  }}
                />
                <circle
                  cx={targetX}
                  cy={targetY}
                  r={isHovered ? 3.5 : 2}
                  fill="#111111"
                  opacity={isHovered ? 0.8 : isAnyHovered ? 0.15 : 0.35}
                  style={{ transition: "r 0.25s ease, opacity 0.25s ease" }}
                />
              </g>
            );
          })}
        </svg>
        {/* Core respondent spinning ring */}
        <div
          className="animate-spin"
          style={{ 
            animationDuration: '40s', 
            width: '320px', 
            height: '320px', 
            border: '0.75px solid rgba(17, 17, 15, 0.08)', 
            borderRadius: '50%',
            position: 'absolute',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />

        {/* Central Core Object */}
        <div
          ref={coreRef}
          onMouseEnter={() => setIsCoreHovered(true)}
          onMouseLeave={() => setIsCoreHovered(false)}
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.42)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.10)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <div
            style={{ 
              transform: isCoreHovered ? 'rotate(25deg)' : 'rotate(0deg)',
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              lineHeight: '1' 
            }}
            className="text-[#11111F] text-2xl font-light select-none"
          >
            &#10033;
          </div>
          <span className="text-[9px] font-mono tracking-widest text-[#6F6D68] uppercase mt-2">
            AEGIS
          </span>
        </div>

        {/* Surrounding Orbital Labels */}
        {labels.map((lbl, idx) => {
          const isHovered = hoveredLabel === lbl.text;
          const isAnyHovered = hoveredLabel !== null && !isHovered;

          return (
            <div
              key={idx}
              ref={el => pillRefs.current[idx] = el}
              style={{
                position: 'absolute',
                top: `calc(50% + ${lbl.cy}px)`,
                left: `calc(50% + ${lbl.cx}px)`,
                marginTop: '-18px',
                marginLeft: '-90px',
                zIndex: 20
              }}
              onMouseEnter={() => setHoveredLabel(lbl.text)}
              onMouseLeave={() => setHoveredLabel(null)}
            >
              {/* Inner container wrapper for ambient yoyo floats */}
              <div ref={el => floatRefs.current[idx] = el}>
                <div
                  style={{
                    scale: isHovered ? 1.04 : 1,
                    y: isHovered ? -2 : 0,
                    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.72)' : 'rgba(255, 255, 255, 0.38)',
                    borderColor: isHovered ? 'rgba(17, 17, 15, 0.30)' : 'rgba(0, 0, 0, 0.10)',
                    opacity: isAnyHovered ? 0.50 : 1,
                    boxShadow: isHovered ? '0 10px 30px rgba(0, 0, 0, 0.07)' : '0 6px 24px rgba(0, 0, 0, 0.035)',
                    transition: "transform 0.25s ease, background-color 0.25s ease, border-color 0.25s ease, opacity 0.25s ease, box-shadow 0.25s ease"
                  }}
                  className="px-4 py-2 border rounded-full backdrop-blur-[12px] -webkit-backdrop-blur-[12px] flex items-center justify-center cursor-pointer min-w-[180px]"
                >
                  <span className="text-[10px] font-mono tracking-widest text-[#111111] font-semibold text-center">
                    {lbl.text}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* 3. Supporting restraining copy */}
      <div 
        className="mt-12 text-center select-none"
        style={{ zIndex: 20 }}
      >
        <p className="text-[11px] font-mono tracking-widest text-[#6F6D68] uppercase">
          "Technology that adapts to the moment — not the other way around."
        </p>
      </div>

    </section>
  );
}
