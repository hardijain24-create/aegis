import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function MarqueeSection() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const isHoveredRef = useRef(false);

  const keywords = [
    'AEGIS',
    'BUILT FOR THE MOMENTS THAT MATTER.',
    'PERSONAL SAFETY',
    'HEALTHCARE',
    'CONNECTED TECHNOLOGY',
    'REAL-TIME RESPONSE',
    'HUMAN-CENTERED SYSTEMS'
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Create seamless loop timeline (xPercent: 0 -> -50)
      const playhead = gsap.to(trackRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 30, // 30 seconds seamless loop
        ease: "none"
      });

      // 2. Track scroll velocity continuously in the GSAP Ticker
      const tickerCallback = () => {
        const vel = ScrollTrigger.getVelocity(); // px per second
        
        // Target speed multiplier based on velocity (cap at 3.5x normal speed)
        const targetMultiplier = 1 + Math.abs(vel) * 0.0006;
        
        // Smoothly interpolate timeScale to avoid jumps
        const currentSpeed = playhead.timeScale();
        const nextSpeed = gsap.utils.interpolate(currentSpeed, targetMultiplier, 0.08);

        // Apply 60% speed reduction if hovered
        const finalSpeed = isHoveredRef.current ? nextSpeed * 0.4 : nextSpeed;
        
        playhead.timeScale(finalSpeed);
      };

      gsap.ticker.add(tickerCallback);

      // Clean up tickers on unmount
      return () => {
        gsap.ticker.remove(tickerCallback);
        playhead.kill();
      };

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Hover triggers
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  // Duplicate items twice to ensure a 100% seamless offset loop
  const repeatedItems = [...keywords, ...keywords];

  return (
    <section 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full bg-[#F2F0EB] py-16 border-b border-[rgba(17,17,15,0.08)] overflow-hidden flex items-center select-none"
    >
      <div 
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform cursor-pointer"
        style={{ display: 'inline-flex' }}
      >
        {/* Track 1 */}
        <div className="flex items-center gap-16 px-8 text-5xl sm:text-6xl font-light font-heading tracking-tight text-[#11110F]">
          {repeatedItems.map((word, idx) => (
            <React.Fragment key={idx}>
              <span>{word}</span>
              <span className="text-[25px] font-medium leading-none text-[#6F6D68]/30 select-none">&#10033;</span>
            </React.Fragment>
          ))}
        </div>
        
        {/* Track 2 (Identical duplicate for offset seamless loop) */}
        <div className="flex items-center gap-16 px-8 text-5xl sm:text-6xl font-light font-heading tracking-tight text-[#11110F]" aria-hidden="true">
          {repeatedItems.map((word, idx) => (
            <React.Fragment key={`dup-${idx}`}>
              <span>{word}</span>
              <span className="text-[25px] font-medium leading-none text-[#6F6D68]/30 select-none">&#10033;</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
