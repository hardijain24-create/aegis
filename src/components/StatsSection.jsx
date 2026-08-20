import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function StatsSection() {
  const containerRef = useRef(null);
  const statsRef = useRef([]);
  const lineRefs = useRef([]);
  const numRefs = useRef([]);

  const [hoveredIdx, setHoveredIdx] = useState(null);

  const metrics = [
    {
      targetVal: 99.99,
      suffix: '%',
      decimals: 2,
      progressTarget: '99.99%',
      label: 'System Uptime',
      desc: 'Distributed fail-safe nodes route priority packets during critical operational moments.'
    },
    {
      targetVal: 12,
      suffix: 'ms',
      decimals: 0,
      progressTarget: '85%',
      label: 'Telemetry Latency',
      desc: 'Optimized local mesh routing coordinates signal transmission in milliseconds.'
    },
    {
      targetVal: 100,
      suffix: '%',
      decimals: 0,
      progressTarget: '100%',
      label: 'End-to-End Security',
      desc: 'Hardware isolated security boundaries ensure coordinate data remains private by design.'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Main scroll timeline triggered once
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none" // trigger once
        }
      });

      // Animate progress lines width
      metrics.forEach((met, idx) => {
        const line = lineRefs.current[idx];
        const num = numRefs.current[idx];
        const stat = statsRef.current[idx];

        if (line && num && stat) {
          // Number translation & fade
          tl.fromTo(stat,
            { opacity: 0.3, y: 20 },
            { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
            idx * 0.15
          );

          // Count up values
          const countObj = { val: 0 };
          tl.to(countObj, {
            val: met.targetVal,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              num.innerHTML = countObj.val.toFixed(met.decimals) + met.suffix;
            }
          }, idx * 0.15);

          // Progress line expansion
          tl.fromTo(line,
            { width: "0%" },
            { width: met.progressTarget, duration: 1.5, ease: "power2.out" },
            idx * 0.15
          );
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Hover actions
  const handleMouseEnter = (idx) => {
    setHoveredIdx(idx);
    const line = lineRefs.current[idx];
    if (line) {
      gsap.to(line, { backgroundColor: '#11110F', height: '3px', duration: 0.25 });
    }
  };

  const handleMouseLeave = (idx) => {
    setHoveredIdx(null);
    const line = lineRefs.current[idx];
    if (line) {
      gsap.to(line, { backgroundColor: 'rgba(17, 17, 15, 0.25)', height: '2px', duration: 0.25 });
    }
  };

  return (
    <section 
      ref={containerRef}
      className="w-full bg-[#E8E6E0] py-32 px-8 sm:px-12 md:px-16 border-b border-[rgba(17,17,15,0.08)] flex flex-col justify-center select-none"
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section tag */}
        <span className="text-[12px] font-mono tracking-widest text-[#686660] uppercase mb-20 block">
          05 / SYSTEM PERFORMANCE
        </span>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:gap-16">
          {metrics.map((met, idx) => {
            const isHovered = hoveredIdx === idx;
            const isAnyHovered = hoveredIdx !== null && !isHovered;

            return (
              <div
                key={idx}
                ref={el => statsRef.current[idx] = el}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                className="flex flex-col cursor-pointer"
                style={{
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  opacity: isAnyHovered ? 0.6 : 1,
                  transition: 'transform 0.35s ease, opacity 0.35s ease'
                }}
              >
                {/* Numeric display */}
                <h3 
                  ref={el => numRefs.current[idx] = el}
                  className="text-6xl sm:text-7xl lg:text-8xl font-light font-heading tracking-tight text-[#11110F] mb-6"
                >
                  0{met.suffix}
                </h3>

                {/* Progress bar line */}
                <div className="w-full bg-[rgba(17,17,15,0.08)] h-[2px] mb-8 relative">
                  <div 
                    ref={el => lineRefs.current[idx] = el}
                    className="h-full bg-[rgba(17,17,15,0.25)] rounded-full"
                    style={{ width: '0%', transition: 'background-color 0.25s ease' }}
                  />
                </div>

                {/* Meta details */}
                <span className="text-[11px] font-mono tracking-widest text-[#11110F] font-bold uppercase mb-3">
                  {met.label}
                </span>
                <p className="text-[#686660] leading-relaxed text-sm font-body max-w-xs">
                  {met.desc}
                </p>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
