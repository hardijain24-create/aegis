import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ConnectSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // 1. Entrance reveal sequence on scroll
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 40%',
          toggleActions: 'play none none none'
        }
      });

      tl.fromTo(headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(subtextRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );

      // 2. Magnetic CTA button (Desktop Only)
      const btn = ctaRef.current;
      const arrow = btn.querySelector('.arrow');

      const handleMouseMove = (e) => {
        if (window.innerWidth < 1024) return;
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < 80) {
          gsap.to(btn, {
            x: (e.clientX - centerX) * 0.25,
            y: (e.clientY - centerY) * 0.25,
            duration: 0.3,
            ease: 'power2.out'
          });
          gsap.to(arrow, {
            x: 5,
            duration: 0.2,
            ease: 'power1.out'
          });
        } else {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
          gsap.to(arrow, { x: 0, duration: 0.3, ease: 'power3.out' });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
        gsap.to(arrow, { x: 0, duration: 0.3, ease: 'power3.out' });
      };

      window.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="w-full min-h-[70vh] bg-[#E8E6E0] py-24 px-8 sm:px-12 md:px-16 flex flex-col justify-center items-start border-b border-[rgba(17,17,15,0.08)]"
    >
      <div className="max-w-3xl">
        <span className="text-[12px] font-mono tracking-widest text-[#686660] uppercase mb-6 block">
          02 / CONNECT
        </span>
        <h2 
          ref={headingRef} 
          className="text-[#11110F] font-semibold leading-[0.95] tracking-tight mb-8 font-heading"
          style={{ fontSize: 'clamp(38px, 6vw, 84px)' }}
        >
          HAVE A<br />
          PROBLEM?
        </h2>
        <p 
          ref={subtextRef} 
          className="text-lg sm:text-xl md:text-2xl text-[#686660] leading-relaxed mb-12 max-w-2xl font-body"
        >
          We build technology for the moments where ordinary solutions aren't enough.
        </p>
        
        {/* Magnetic Button */}
        <div className="inline-block">
          <button 
            ref={ctaRef}
            className="inline-flex items-center gap-3 bg-[#11110F] text-[#F2F0EB] px-8 py-4 rounded-full text-[15px] font-medium tracking-wide transition-colors duration-300 hover:bg-[#686660] cursor-pointer"
            onClick={() => window.location.href = '#contact'}
          >
            Let's build something useful 
            <span className="arrow transition-transform duration-200">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
