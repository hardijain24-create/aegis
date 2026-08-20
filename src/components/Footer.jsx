import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const customEase = [0.16, 1, 0.3, 1];

  return (
    <motion.footer 
      className="w-full bg-[#11110F] text-[#F2F0EB] py-16 px-8 sm:px-12 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-neutral-800"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: customEase }}
    >
      <div className="flex flex-row items-center gap-2 select-none text-[21px] sm:text-[26px] tracking-tight font-medium font-heading">
        AEGIS&reg;
        <span className="text-[25px] sm:text-[30px] font-medium leading-none select-none">&#10033;</span>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-sm tracking-wide text-neutral-400 font-body">
        <a href="#products" className="hover:text-white transition-colors">Products</a>
        <a href="#about" className="hover:text-white transition-colors">About</a>
        <a href="#contact" className="hover:text-white transition-colors">Contact</a>
      </div>

      <div className="text-sm tracking-wide text-neutral-500 font-mono">
        &copy; 2026 AEGIS
      </div>
    </motion.footer>
  );
}
