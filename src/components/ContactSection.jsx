import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  const submitRef = useRef(null);
  const customEase = [0.16, 1, 0.3, 1];

  // Magnetic button state values
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [arrowX, setArrowX] = useState(0);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return;
    const btn = submitRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

    if (dist < 70) {
      setCoords({
        x: (e.clientX - centerX) * 0.2,
        y: (e.clientY - centerY) * 0.2
      });
      setArrowX(4);
    } else {
      setCoords({ x: 0, y: 0 });
      setArrowX(0);
    }
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
    setArrowX(0);
  };

  return (
    <section 
      id="contact" 
      className="w-full bg-[#F2F0EB] py-32 px-8 sm:px-12 md:px-16 flex flex-col justify-center border-b border-[rgba(17,17,15,0.08)]"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Headline */}
        <div>
          <motion.span 
            className="text-[12px] font-mono tracking-widest text-[#686660] uppercase mb-12 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: customEase }}
          >
            05 / INQUIRIES
          </motion.span>
          <motion.h2 
            className="text-[#11110F] font-semibold leading-[0.95] tracking-tight mb-8 font-heading"
            style={{ fontSize: 'clamp(38px, 5.5vw, 80px)' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: customEase, delay: 0.1 }}
          >
            LET'S BUILD<br />
            WHAT MATTERS.
          </motion.h2>
          <motion.p 
            className="text-lg text-[#686660] font-body max-w-sm leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: customEase, delay: 0.2 }}
          >
            Get in touch to collaborate on personal safety systems, healthcare coordination software, or sensory processing hardware.
          </motion.p>
        </div>

        {/* Right Form */}
        <motion.form 
          className="flex flex-col gap-8 w-full max-w-xl"
          onSubmit={(e) => { e.preventDefault(); alert("Inquiry received. Thank you."); }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: customEase, delay: 0.2 }}
        >
          <div className="flex flex-col border-b border-[rgba(17,17,15,0.15)] pb-3">
            <label className="text-[10px] font-mono tracking-wider text-[#686660] uppercase mb-2">Name</label>
            <input 
              type="text" 
              required
              className="bg-transparent border-none outline-none text-[#11110F] font-body text-lg placeholder-neutral-400"
              placeholder="Your full name"
            />
          </div>

          <div className="flex flex-col border-b border-[rgba(17,17,15,0.15)] pb-3">
            <label className="text-[10px] font-mono tracking-wider text-[#686660] uppercase mb-2">Email</label>
            <input 
              type="email" 
              required
              className="bg-transparent border-none outline-none text-[#11110F] font-body text-lg placeholder-neutral-400"
              placeholder="you@domain.com"
            />
          </div>

          <div className="flex flex-col border-b border-[rgba(17,17,15,0.15)] pb-3">
            <label className="text-[10px] font-mono tracking-wider text-[#686660] uppercase mb-2">Inquiry Field</label>
            <input 
              type="text" 
              className="bg-transparent border-none outline-none text-[#11110F] font-body text-lg placeholder-neutral-400"
              placeholder="Personal Safety / Healthcare Operations / Hardware Engineering"
            />
          </div>

          <div className="flex flex-col border-b border-[rgba(17,17,15,0.15)] pb-3">
            <label className="text-[10px] font-mono tracking-wider text-[#686660] uppercase mb-2">Message</label>
            <input 
              type="text" 
              required
              className="bg-transparent border-none outline-none text-[#11110F] font-body text-lg placeholder-neutral-400"
              placeholder="How can we collaborate?"
            />
          </div>

          <div className="mt-4">
            <motion.button 
              ref={submitRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              animate={{ x: coords.x, y: coords.y }}
              transition={{ type: "spring", stiffness: 180, damping: 15 }}
              type="submit" 
              className="inline-flex items-center gap-3 bg-[#11110F] text-[#F2F0EB] px-8 py-4 rounded-full text-[15px] font-medium tracking-wide transition-colors duration-300 hover:bg-[#686660] cursor-pointer"
            >
              Get in touch 
              <motion.span animate={{ x: arrowX }} className="inline-block">→</motion.span>
            </motion.button>
          </div>
        </motion.form>

      </div>
    </section>
  );
}
