import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function ProductsSection() {
  const containerRef = useRef(null);
  const incomingCardRef = useRef(null);
  const incomingTextRefs = useRef([]);
  const transitionRef = useRef(null);
  const isTransitioningRef = useRef(false);

  const [activeIdx, setActiveIdx] = useState(0);

  const products = [
    {
      tag: '01 / EMERGENCY RESPONSE',
      title: 'GUARDIAN',
      desc: 'Real-time SOS alerts, live location tracking, and automated emergency dispatch — built for the seconds that decide everything.',
      cta: 'Explore GUARDIAN',
      img: '/guardian.jpg',
      id: 'guardian',
      gradient: 'linear-gradient(90deg, #6F716D 0%, #B8BAB4 100%)'
    },
    {
      tag: '02 / HOSPITAL MANAGEMENT',
      title: 'COREPULSE',
      desc: 'One system for bed availability, patient records, staff scheduling, and department coordination — built to keep a hospital moving.',
      cta: 'Explore COREPULSE',
      img: '/corepulse.jpg',
      id: 'corepulse',
      gradient: 'linear-gradient(90deg, #A9C4C0 0%, #F0E8D8 100%)'
    }
  ];

  const triggerFlip = (nextIdx) => {
    if (isTransitioningRef.current || !incomingCardRef.current) return;

    isTransitioningRef.current = true;

    const nextProduct = products[nextIdx];
    const textRefs = incomingTextRefs.current.filter(Boolean);

    transitionRef.current = gsap.timeline({
      onComplete: () => {
        setActiveIdx(nextIdx);
        isTransitioningRef.current = false;
      }
    });

    transitionRef.current
      .to(incomingCardRef.current, {
        height: '100%',
        duration: 1,
        ease: 'power2.inOut'
      })
      .to(textRefs, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.06,
        ease: 'power2.out'
      }, 0.7);
  };

  useEffect(() => {
    gsap.set(incomingCardRef.current, { height: '10px' });
    gsap.set(incomingTextRefs.current.filter(Boolean), { opacity: 0, y: 12 });
  }, [activeIdx]);

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      triggerFlip(activeIdx === 0 ? 1 : 0);
    }
  };

  const activeProduct = products[activeIdx];
  const nextProduct = products[activeIdx === 0 ? 1 : 0];

  return (
    <section 
      ref={containerRef}
      id="products"
      className="w-full bg-[#F2F0EB] py-0 px-8 sm:px-12 md:px-16 border-b border-[rgba(17,17,15,0.08)] relative flex flex-col items-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        
        {/* Section Header - More compact */}
        <div className="w-full flex flex-col items-center select-none text-center mb-16 pt-16 md:pt-20">
          <span className="text-[12px] font-mono tracking-widest text-[#686660] uppercase mb-3 block">
            02 / PRODUCTS
          </span>
          <h2 className="text-[#11110f] font-semibold tracking-tight font-heading mb-2" style={{ fontSize: 'clamp(28px, 4.5vw, 56px)' }}>
            PRODUCT SPOTLIGHT
          </h2>
          <p className="text-[#686660] text-sm tracking-wide font-mono uppercase">
            Technology for the moments that matter.
          </p>
        </div>

        {/* Spotlight Presentation Area - Optimized for viewport */}
        <div 
          className="relative w-full"
          style={{ minHeight: '100vh', paddingTop: '0px' }}
        >
          {/* The stage clips the incoming card as it grows downward. */}
          <div
            onClick={() => triggerFlip(activeIdx === 0 ? 1 : 0)}
            onKeyDown={handleCardKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Reveal ${nextProduct.title}`}
            className="products-first-card spotlight-card-stage relative z-10 w-full overflow-hidden rounded-[8px] border border-[rgba(17,17,15,0.08)] bg-[#E8E6E0] shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            style={{
              minHeight: '100vh',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div 
                className="absolute inset-0 flex min-h-full flex-col justify-between"
            >
                <div className="h-[45vh] min-h-[280px] w-full overflow-hidden bg-neutral-100">
                  <img className="h-full w-full object-cover" src={activeProduct.img} alt={activeProduct.title} />
              </div>

                <div className="flex flex-1 flex-col justify-between p-8 md:p-12 lg:p-16">
                <div>
                    <span className="label mb-4 block font-mono text-[10px] uppercase tracking-widest text-[#686660]">
                    {activeProduct.tag}
                  </span>
                    <h3 className="title mb-4 font-heading text-4xl font-semibold uppercase tracking-wide text-[#11110F] md:text-6xl">
                    {activeProduct.title}
                  </h3>
                    <p className="description max-w-2xl font-body text-sm leading-relaxed text-[#686660] md:text-base">
                    {activeProduct.desc}
                  </p>
                </div>
                
                  <div className="cta mt-10 flex items-center gap-2 text-xs font-medium tracking-wide text-[#11110F]">
                  <span>{activeProduct.cta}</span>
                  <span>→</span>
                </div>
              </div>
            </div>

              {/* Incoming card: a full card clipped to a thin top strip before transition. */}
            <div
                ref={incomingCardRef}
                className="absolute left-0 top-0 z-10 flex w-full flex-col overflow-hidden rounded-[8px] border border-[rgba(17,17,15,0.08)] shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                style={{ height: '10px', background: '#E8E6E0', willChange: 'height' }}
              >
                <div className="h-[45vh] min-h-[280px] w-full shrink-0 overflow-hidden bg-neutral-100">
                  <img className="h-full w-full object-cover" src={nextProduct.img} alt={nextProduct.title} />
                </div>
                <div className="flex flex-1 flex-col justify-between p-8 md:p-12 lg:p-16">
                  <div>
                  <span ref={el => incomingTextRefs.current[0] = el} className="mb-4 block translate-y-3 font-mono text-[10px] uppercase tracking-widest text-[#686660] opacity-0">{nextProduct.tag}</span>
                  <h3 ref={el => incomingTextRefs.current[1] = el} className="mb-4 translate-y-3 font-heading text-4xl font-semibold uppercase tracking-wide text-[#11110F] opacity-0 md:text-6xl">{nextProduct.title}</h3>
                  <p ref={el => incomingTextRefs.current[2] = el} className="max-w-2xl translate-y-3 font-body text-sm leading-relaxed text-[#686660] opacity-0 md:text-base">{nextProduct.desc}</p>
                  </div>
                <div ref={el => incomingTextRefs.current[3] = el} className="mt-10 flex translate-y-3 items-center gap-2 text-xs font-medium tracking-wide text-[#11110F] opacity-0">
                  <span>{nextProduct.cta}</span>
                    <span>→</span>
                  </div>
                </div>
              </div>

          </div>

          <div
            className="spotlight-peek absolute left-0 top-0 z-20 h-[10px] w-full"
            style={{ background: nextProduct.gradient }}
          />

        </div>

      </div>
    </section>
  );
}
