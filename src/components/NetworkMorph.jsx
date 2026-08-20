import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

export default function NetworkMorph() {
  const containerRef = useRef(null);
  const coreRef = useRef(null);
  
  // Interaction states
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [isCoreHovered, setIsCoreHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check accessibility settings
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Performance: mouse parallax values via motion values
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { damping: 40, stiffness: 220 });
  const mouseY = useSpring(rawMouseY, { damping: 40, stiffness: 220 });

  // Core tracking angle motion values
  const coreRotation = useMotionValue(0);
  const coreRotationSpring = useSpring(coreRotation, { damping: 35, stiffness: 180 });

  // Rotation unwrapping state references
  const lastAngleRef = useRef(0);
  const angleRef = useRef(0);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024 || prefersReducedMotion) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5; 
    const yVal = (e.clientY - rect.top) / rect.height - 0.5; 
    
    rawMouseX.set(xVal);
    rawMouseY.set(yVal);

    // Compute angle to center of the core
    const core = coreRef.current;
    if (core) {
      const coreRect = core.getBoundingClientRect();
      const coreCenterX = coreRect.left + coreRect.width / 2;
      const coreCenterY = coreRect.top + coreRect.height / 2;
      
      const dx = e.clientX - coreCenterX;
      const dy = e.clientY - coreCenterY;
      
      const currentAngle = Math.atan2(dy, dx);
      let diff = currentAngle - lastAngleRef.current;
      
      const PI = Math.PI;
      if (diff > PI) diff -= 2 * PI;
      else if (diff < -PI) diff += 2 * PI;
      
      angleRef.current += diff;
      lastAngleRef.current = currentAngle;
      
      // Convert to degrees for Framer Motion
      const angleDeg = angleRef.current * (180 / PI);
      coreRotation.set(angleDeg);
    }
  };

  const handleMouseLeave = () => {
    rawMouseX.set(0);
    rawMouseY.set(0);
  };

  // Scroll scale parallax transitions for the entire map
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const sectionScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.96]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.3, 1, 1, 0.3]);

  // Labels structure with coordinates relative to (250, 250) in a 500x500 viewport
  const labels = [
    { text: 'ADAPTIVE TECHNOLOGY', cx: 0, cy: -180, delay: 0, floatDuration: 5.5, parallaxMax: 18 },
    { text: 'HUMAN-CENTERED DESIGN', cx: -180, cy: -110, delay: 0.1, floatDuration: 6.0, parallaxMax: 15 },
    { text: 'CONNECTED HARDWARE', cx: 180, cy: -120, delay: 0.2, floatDuration: 6.5, parallaxMax: 16 },
    { text: 'PERSONAL SAFETY', cx: -220, cy: 0, delay: 0.3, floatDuration: 7.0, parallaxMax: 20 },
    { text: 'REAL-TIME RESPONSE', cx: 220, cy: -10, delay: 0.4, floatDuration: 5.8, parallaxMax: 19 },
    { text: 'HEALTHCARE SYSTEMS', cx: -160, cy: 130, delay: 0.5, floatDuration: 6.2, parallaxMax: 14 },
    { text: 'INTELLIGENT SOFTWARE', cx: 170, cy: 110, delay: 0.6, floatDuration: 6.8, parallaxMax: 17 },
    { text: 'SECURE BY DESIGN', cx: 0, cy: 190, delay: 0.7, floatDuration: 7.2, parallaxMax: 13 }
  ];

  const customEase = [0.16, 1, 0.3, 1];

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full bg-[#E8E6E0] py-32 px-8 sm:px-12 md:px-16 border-b border-[rgba(17,17,15,0.08)] relative overflow-hidden flex flex-col items-center justify-center select-none"
      style={{ minHeight: '800px' }}
    >
      
      {/* 1. Header tag */}
      <div className="absolute top-12 left-8 sm:left-12 md:left-16 z-20">
        <span className="text-[12px] font-mono tracking-widest text-[#6F6D68] uppercase block">
          03 / ADAPTIVE ARCHITECTURE
        </span>
      </div>

      {/* 2. Scroll-linked overall container wrapper */}
      <motion.div 
        style={{ scale: prefersReducedMotion ? 1 : sectionScale, opacity: sectionOpacity }}
        className="w-full max-w-5xl flex flex-col items-center justify-center relative"
      >
        
        {/* Constellation Canvas wrapper */}
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
              const isHovered = hoveredLabel === lbl.text;
              const isAnyHovered = hoveredLabel !== null && !isHovered;

              return (
                <g key={idx}>
                  {/* Drawing connection line */}
                  <motion.line
                    x1="250"
                    y1="250"
                    x2={targetX}
                    y2={targetY}
                    stroke="#111111"
                    strokeWidth={isHovered ? 1.5 : 0.75}
                    opacity={isHovered ? 0.65 : isCoreHovered ? 0.45 : isAnyHovered ? 0.12 : 0.22}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      pathLength: { duration: 1.2, ease: customEase, delay: 0.2 + lbl.delay * 0.4 }
                    }}
                  />
                  {/* Circular node where line meets labels */}
                  <motion.circle
                    cx={targetX}
                    cy={targetY}
                    r={isHovered ? 3.5 : 2}
                    fill="#111111"
                    opacity={isHovered ? 0.8 : isAnyHovered ? 0.15 : 0.35}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2 + lbl.delay * 0.2 }}
                  />
                </g>
              );
            })}
          </svg>

          {/* orbital system thin outer ring */}
          <motion.div
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              border: '0.75px solid rgba(17, 17, 15, 0.08)',
              borderRadius: '50%',
              zIndex: 0,
              pointerEvents: 'none'
            }}
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: customEase, delay: 0.3 }}
            animate={prefersReducedMotion ? {} : { rotate: 360 }}
            // Extremely slow ambient rotation: 40 seconds per turn
            duration={40}
          />

          {/* Central core object */}
          <motion.div
            ref={coreRef}
            onMouseEnter={() => setIsCoreHovered(true)}
            onMouseLeave={() => setIsCoreHovered(false)}
            style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.10)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              x: prefersReducedMotion ? 0 : useTransform(mouseX, (val) => val * 3),
              y: prefersReducedMotion ? 0 : useTransform(mouseY, (val) => val * 3)
            }}
            initial={{ scale: 0.75, opacity: 0, filter: 'blur(4px)' }}
            whileInView={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: customEase }}
          >
            {/* Core responds to cursor orientation dynamically */}
            <motion.div
              style={{ 
                rotate: prefersReducedMotion ? 0 : coreRotationSpring,
                lineHeight: '1' 
              }}
              className="text-[#11111F] text-2xl font-light select-none"
            >
              &#10033;
            </motion.div>
            <span className="text-[9px] font-mono tracking-widest text-[#6F6D68] uppercase mt-2">
              AEGIS
            </span>
          </motion.div>

          {/* Surrounding Orbital Labels */}
          {labels.map((lbl, idx) => {
            const isHovered = hoveredLabel === lbl.text;
            const isAnyHovered = hoveredLabel !== null && !isHovered;

            // Parallax offset motion values
            const xOffset = useTransform(mouseX, (val) => val * lbl.parallaxMax);
            const yOffset = useTransform(mouseY, (val) => val * lbl.parallaxMax);

            return (
              <motion.div
                key={idx}
                onMouseEnter={() => setHoveredLabel(lbl.text)}
                onMouseLeave={() => setHoveredLabel(null)}
                style={{
                  position: 'absolute',
                  transformOrigin: 'center',
                  x: prefersReducedMotion ? 0 : xOffset,
                  y: prefersReducedMotion ? 0 : yOffset,
                  // CSS translate displacement offsets
                  top: `calc(50% + ${lbl.cy}px)`,
                  left: `calc(50% + ${lbl.cx}px)`,
                  marginTop: '-18px', // offset half element height
                  marginLeft: '-90px', // offset half element width
                  zIndex: 20
                }}
                initial={{ opacity: 0, scale: 0.85, x: -lbl.cx * 0.2, y: -lbl.cy * 0.2 }}
                whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: customEase, delay: 0.4 + lbl.delay * 0.15 }}
              >
                {/* Slow ambient floating container */}
                <motion.div
                  animate={prefersReducedMotion ? {} : { y: [0, -3, 0] }}
                  transition={{
                    duration: lbl.floatDuration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: lbl.delay
                  }}
                >
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.04 : 1,
                      y: isHovered ? -2 : 0,
                      backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.72)' : 'rgba(255, 255, 255, 0.38)',
                      borderColor: isHovered ? 'rgba(17, 17, 15, 0.30)' : 'rgba(0, 0, 0, 0.10)',
                      opacity: isAnyHovered ? 0.50 : 1,
                      boxShadow: isHovered ? '0 10px 30px rgba(0, 0, 0, 0.07)' : '0 6px 24px rgba(0, 0, 0, 0.035)'
                    }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="px-4 py-2 border rounded-full backdrop-blur-[12px] -webkit-backdrop-blur-[12px] flex items-center justify-center cursor-pointer min-w-[180px]"
                  >
                    <span className="text-[10px] font-mono tracking-widest text-[#111111] font-semibold text-center">
                      {lbl.text}
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}

        </div>

        {/* 3. Supporting restraining copy */}
        <motion.div 
          className="mt-12 text-center select-none"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: customEase, delay: 1.0 }}
        >
          <p className="text-[11px] font-mono tracking-widest text-[#6F6D68] uppercase">
            "Technology that adapts to the moment — not the other way around."
          </p>
        </motion.div>

      </motion.div>

    </section>
  );
}
