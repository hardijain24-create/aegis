import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorFollower() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 300, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable entirely on touch and mobile devices
    if (window.innerWidth < 1024 || 'ontouchstart' in window) {
      return;
    }

    setIsVisible(true);

    const moveCursor = (e) => {
      // Offset by radius (4px default, 16px when hovered)
      const r = isHovered ? 16 : 4;
      cursorX.set(e.clientX - r);
      cursorY.set(e.clientY - r);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' ||
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.cursor-pointer');

      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isHovered]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: isHovered ? 32 : 8,
        height: isHovered ? 32 : 8,
        borderRadius: '50%',
        backgroundColor: '#111111',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        backgroundColor: isHovered ? '#ffffff' : '#111111',
      }}
      transition={{ duration: 0.15 }}
    />
  );
}
