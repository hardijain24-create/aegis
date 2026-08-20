import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AboutSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "top 35%",
          scrub: 0.8,
        }
      });

      // 1. Subtitle tag reveal
      tl.fromTo(".about-tag",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4 },
        0
      );

      // 2. Headline mask reveal line-by-line (y: 110% -> 0, opacity: 0.15 -> 1)
      tl.fromTo(".about-line",
        { opacity: 0.15, y: "110%" },
        { opacity: 1, y: 0, stagger: 0.12, duration: 1.0, ease: "none" },
        0.1
      );

      // 3. Secondary paragraphs reveal
      tl.fromTo(".about-secondary-text",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power2.out" },
        0.6
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="w-full bg-[#E8E6E0] py-32 px-8 sm:px-12 md:px-16 border-b border-[rgba(17,17,15,0.08)]"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-start text-left select-none">
        
        {/* Subtitle tag */}
        <span className="about-tag text-[12px] font-mono tracking-widest text-[#686660] uppercase mb-12 block">
          04 / ABOUT COMPANY
        </span>        

        {/* Heading with mask inline-block elements */}
        <h2 
          className="text-[#11110F] font-semibold tracking-tight leading-[1.05] mb-12 font-heading"
          style={{ fontSize: 'clamp(28px, 4.5vw, 64px)' }}
        >
          <div style={{ overflow: 'hidden' }}>
            <span className="about-line inline-block">Technology should not</span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span className="about-line inline-block">make life more complicated.</span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span className="about-line inline-block">It should make difficult</span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span className="about-line inline-block">moments easier.</span>
          </div>
        </h2>

        {/* Supporting paragraphs block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base sm:text-lg text-[#686660] font-body max-w-3xl leading-relaxed">
          <div className="about-secondary-text">
            Aegis builds technology around real human problems. We focus on engineering solutions that provide safety and operational clarity when response time, security, and coordination are critical.
          </div>
          <div className="about-secondary-text">
            By designing infrastructure and hardware that disappear into utility, we aim to protect and connect everyday life without adding cognitive noise or corporate clutter.
          </div>
        </div>

      </div>
    </section>
  );
}
