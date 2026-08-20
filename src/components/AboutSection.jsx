import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  const customEase = [0.16, 1, 0.3, 1];

  return (
    <section 
      id="about" 
      className="w-full bg-[#E8E6E0] py-32 px-8 sm:px-12 md:px-16 border-b border-[rgba(17,17,15,0.08)]"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-start text-left select-none">
        
        <motion.span 
          className="text-[12px] font-mono tracking-widest text-[#686660] uppercase mb-12 block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: customEase }}
        >
          04 / ABOUT COMPANY
        </motion.span>

        {/* Heading */}
        <motion.h2 
          className="text-[#11110F] font-semibold tracking-tight leading-[1.05] mb-12 font-heading"
          style={{ fontSize: 'clamp(28px, 4.5vw, 64px)' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: customEase, delay: 0.1 }}
        >
          Technology should not<br />
          make life more complicated.<br />
          It should make difficult<br />
          moments easier.
        </motion.h2>

        {/* Supporting paragraphs block */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base sm:text-lg text-[#686660] font-body max-w-3xl leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: customEase, delay: 0.2 }}
        >
          <div>
            Aegis builds technology around real human problems. We focus on engineering solutions that provide safety and operational clarity when response time, security, and coordination are critical.
          </div>
          <div>
            By designing infrastructure and hardware that disappear into utility, we aim to protect and connect everyday life without adding cognitive noise or corporate clutter.
          </div>
        </motion.div>

      </div>
    </section>
  );
}
