import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ProductsSection() {
  const sectionRef = useRef(null);

  // Parallax coordination for card images
  const [parallax1, setParallax1] = useState({ x: 0, y: 0 });
  const [parallax2, setParallax2] = useState({ x: 0, y: 0 });

  // Scroll mapping for opposing horizontal shifts
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const headingX = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const customEase = [0.16, 1, 0.3, 1];

  // Clip-path image entry reveals
  const imageClipVariants = {
    hidden: { 
      clipPath: "inset(8% 8% 8% 8%)", 
      opacity: 0, 
      scale: 1.03 
    },
    visible: { 
      clipPath: "inset(0% 0% 0% 0%)", 
      opacity: 1, 
      scale: 1,
      transition: { duration: 1.2, ease: customEase }
    }
  };

  const cardContainerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: customEase }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: customEase, delay: 0.2 }
    }
  };

  // Stagger variants for the left-to-right "walking" text
  const walkContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const walkWordVariants = {
    hidden: { 
      opacity: 0, 
      x: -20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: customEase }
    }
  };

  const handleMouseMove = (e, setCoords) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5; // [-0.5, 0.5]
    const yVal = (e.clientY - rect.top) / rect.height - 0.5; // [-0.5, 0.5]
    setCoords({ x: xVal * 12, y: yVal * 8 }); // Max 5-8px movement
  };

  const handleMouseLeave = (setCoords) => {
    setCoords({ x: 0, y: 0 });
  };

  const walkingWords = ["WHEN", "THE", "MOMENT", "CHANGES,", "AEGIS", "RESPONDS."];

  return (
    <section 
      ref={sectionRef}
      id="products" 
      className="w-full bg-[#F2F0EB] py-24 px-8 sm:px-12 md:px-16 border-b border-[rgba(17,17,15,0.08)]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.span 
          className="text-[12px] font-mono tracking-widest text-[#686660] uppercase mb-12 block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: customEase }}
        >
          02 / PRODUCTS
        </motion.span>

        {/* Headline with opposing scroll movement and staggered walking text */}
        <div style={{ overflow: 'hidden' }} className="mb-20">
          <motion.div 
            className="max-w-4xl select-none flex flex-wrap gap-x-4 gap-y-1 font-heading text-[#11110f] font-semibold leading-[0.95]"
            style={{ x: headingX, fontSize: 'clamp(32px, 5.5vw, 68px)' }}
            variants={walkContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {walkingWords.map((word, idx) => (
              <motion.span 
                key={idx} 
                variants={walkWordVariants}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Product list - 2 Columns (Safety & Healthcare) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
          
          {/* Card 1: Safety (Guardian) */}
          <motion.div 
            className="flex flex-col bg-[#E8E6E0] border border-[rgba(17,17,15,0.06)] rounded-[8px] overflow-hidden cursor-pointer"
            initial="hidden"
            whileInView="visible"
            whileHover={{ y: -5 }}
            viewport={{ once: true, margin: "-100px" }}
            variants={cardContainerVariants}
            onMouseMove={(e) => handleMouseMove(e, setParallax1)}
            onMouseLeave={() => handleMouseLeave(setParallax1)}
          >
            <motion.div 
              className="w-full aspect-[3/2] overflow-hidden bg-neutral-100"
              variants={imageClipVariants}
            >
              <motion.img 
                animate={{ x: parallax1.x, y: parallax1.y, scale: 1.01 }}
                whileHover={{ scale: 1.035 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-full h-full object-cover origin-center"
                src="/guardian.jpg" 
                alt="Aegis Guardian wearable safety sensor device" 
              />
            </motion.div>
            
            <motion.div className="p-8 sm:p-10 flex flex-col justify-between flex-1" variants={textVariants}>
              <div>
                <span className="text-[11px] font-mono tracking-wider text-[#686660] uppercase mb-3 block">
                  PERSONAL SAFETY
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#11110F] mb-4 font-heading">
                  Guardian
                </h3>
                <p className="text-[#686660] leading-relaxed max-w-md font-body text-base">
                  A safety-focused product designed around moments where response time matters. Built to disappear into your routine while keeping you connected.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-[#11110F] text-[15px] font-medium tracking-wide">
                <span>Discover Guardian</span>
                <span>→</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Card 2: Healthcare (CorePulse) */}
          <motion.div 
            className="flex flex-col bg-[#E8E6E0] border border-[rgba(17,17,15,0.06)] rounded-[8px] overflow-hidden cursor-pointer"
            initial="hidden"
            whileInView="visible"
            whileHover={{ y: -5 }}
            viewport={{ once: true, margin: "-100px" }}
            variants={cardContainerVariants}
            onMouseMove={(e) => handleMouseMove(e, setParallax2)}
            onMouseLeave={() => handleMouseLeave(setParallax2)}
          >
            <motion.div 
              className="w-full aspect-[3/2] overflow-hidden bg-neutral-100"
              variants={imageClipVariants}
            >
              <motion.img 
                animate={{ x: parallax2.x, y: parallax2.y, scale: 1.01 }}
                whileHover={{ scale: 1.035 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-full h-full object-cover origin-center"
                src="/corepulse.jpg" 
                alt="Healthcare coordinating workflow layers" 
              />
            </motion.div>
            
            <motion.div className="p-8 sm:p-10 flex flex-col justify-between flex-1" variants={textVariants}>
              <div>
                <span className="text-[11px] font-mono tracking-wider text-[#686660] uppercase mb-3 block">
                  HEALTHCARE
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#11110F] mb-4 font-heading">
                  CorePulse
                </h3>
                <p className="text-[#686660] leading-relaxed max-w-md font-body text-base">
                  Technology for better healthcare management and coordination. Unifying clinics, systems, and patient workflows into one synchronized network.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-[#11110F] text-[15px] font-medium tracking-wide">
                <span>Explore CorePulse</span>
                <span>→</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
