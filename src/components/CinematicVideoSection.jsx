import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CinematicVideoSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // Desktop Pinned Cinematic Experience (min-width: 1024px)
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=1800", // Pinned viewport duration length
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        // 0-20% scroll: AEGIS enters
        tl.fromTo(".word-aegis", 
          { opacity: 0, scale: 0.8, y: 30, filter: "blur(8px)" },
          { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
          0
        );
        // Video background starts zoom
        tl.fromTo(".cinematic-video-bg", 
          { scale: 1 }, 
          { scale: 1.05, duration: 4.0, ease: "none" }, 
          0
        );

        // 20-35% scroll: AEGIS exits
        tl.to(".word-aegis", 
          { opacity: 0, scale: 1.08, y: -30, filter: "blur(4px)", duration: 0.6, ease: "power2.in" },
          0.8
        );

        // 35-50% scroll: ADAPTS. enters & exits
        tl.fromTo(".word-adapts",
          { opacity: 0, y: 30, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out" },
          1.4
        );
        tl.to(".word-adapts",
          { opacity: 0, y: -30, filter: "blur(4px)", duration: 0.5, ease: "power2.in" },
          2.0
        );

        // 50-65% scroll: RESPONDS. enters & exits
        tl.fromTo(".word-responds",
          { opacity: 0, y: 30, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out" },
          2.5
        );
        tl.to(".word-responds",
          { opacity: 0, y: -30, filter: "blur(4px)", duration: 0.5, ease: "power2.in" },
          3.1
        );

        // 65-80% scroll: PROTECTS. enters
        tl.fromTo(".word-protects",
          { opacity: 0, y: 30, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out" },
          3.6
        );

        // 80-95% scroll: Secondary subline slides in
        tl.fromTo(".cinematic-subline",
          { opacity: 0, y: 20 },
          { opacity: 0.8, y: 0, duration: 0.5, ease: "power2.out" },
          3.9
        );

        // 95-100% scroll: Global fade out to next section
        tl.to([".word-protects", ".cinematic-subline", ".cinematic-video-bg", ".cinematic-overlay"], 
          { opacity: 0, duration: 0.6, ease: "power2.inOut" },
          4.5
        );
      });

      // Tablet / Mobile: Shorter pinned timeline (max-width: 1023px)
      mm.add("(max-width: 1023px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=700",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        // Simpler sequence on mobile (AEGIS -> RESPOND -> Fade)
        tl.fromTo(".word-aegis", 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
          0
        );
        tl.to(".word-aegis", 
          { opacity: 0, y: -20, duration: 0.8, ease: "power2.in" },
          1.0
        );
        tl.fromTo(".word-responds", 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
          1.8
        );
        tl.fromTo(".cinematic-subline",
          { opacity: 0, y: 15 },
          { opacity: 0.8, y: 0, duration: 0.8, ease: "power2.out" },
          2.0
        );
        tl.to([".word-responds", ".cinematic-subline", ".cinematic-video-bg", ".cinematic-overlay"], 
          { opacity: 0, duration: 0.8, ease: "power2.inOut" },
          2.8
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="w-full bg-[#11110F] relative overflow-hidden"
      style={{ height: '100vh' }}
    >
      {/* Background Video Layer */}
      <video
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        className="cinematic-video-bg absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
      />

      {/* Dark/Cream architectural glass overlay */}
      <div className="cinematic-overlay absolute inset-0 bg-[#11110F]/30 backdrop-blur-[2px] z-10" />

      {/* Text Sequence Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-8 text-center select-none">
        
        {/* Absolute aligned sequence words */}
        <h2 className="text-[#F2F0EB] font-light tracking-tight font-heading leading-none relative w-full flex items-center justify-center" style={{ fontSize: 'clamp(44px, 10vw, 110px)', height: '150px' }}>
          
          <span className="word-aegis absolute opacity-0">AEGIS</span>
          
          <span className="word-adapts absolute opacity-0">ADAPTS.</span>
          
          <span className="word-responds absolute opacity-0">RESPONDS.</span>
          
          <span className="word-protects absolute opacity-0">PROTECTS.</span>

        </h2>

        {/* Supporting subline details */}
        <p className="cinematic-subline text-[11px] font-mono tracking-widest text-[#F2F0EB]/60 uppercase mt-12 opacity-0">
          Technology that responds when it matters.
        </p>

      </div>
    </section>
  );
}
