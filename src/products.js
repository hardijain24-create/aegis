export function initGuardianVisual(canvasId = 'guardianCanvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let isHovered = false;
  let hoverProgress = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);

  // Hover detection
  const container = canvas.closest('.product-visual-container');
  if (container) {
    container.addEventListener('mouseenter', () => isHovered = true);
    container.addEventListener('mouseleave', () => isHovered = false);
  }

  function draw() {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    ctx.clearRect(0, 0, w, h);

    // Smooth hover progress
    if (isHovered) {
      hoverProgress += (1 - hoverProgress) * 0.1;
    } else {
      hoverProgress += (0 - hoverProgress) * 0.1;
    }

    const cx = w / 2;
    const cy = h / 2;

    // Draw grid rule backgrounds
    ctx.strokeStyle = 'rgba(23, 24, 23, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let j = 0; j < h; j += 40) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
    }

    // Draw Guardian Outer Shell (Industrial Design)
    ctx.strokeStyle = 'rgba(23, 24, 23, 0.8)';
    ctx.lineWidth = 1.5;
    
    // Draw an elegant physical safety device casing (shield / pebble outline)
    ctx.beginPath();
    ctx.roundRect(cx - 70, cy - 110, 140, 220, 40);
    ctx.stroke();

    // Draw internal casing structure
    ctx.strokeStyle = 'rgba(23, 24, 23, 0.2)';
    ctx.beginPath();
    ctx.roundRect(cx - 60, cy - 100, 120, 200, 30);
    ctx.stroke();

    // Internal components: progressive reveal on hover
    if (hoverProgress > 0.05) {
      // Core module (safety sensor hub)
      ctx.strokeStyle = `rgba(23, 24, 23, ${hoverProgress * 0.7})`;
      ctx.fillStyle = `rgba(23, 24, 23, ${hoverProgress * 0.03})`;
      
      // Central sensor ring
      ctx.beginPath();
      ctx.arc(cx, cy - 20, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Battery & Power cells
      ctx.beginPath();
      ctx.roundRect(cx - 40, cy + 40, 80, 45, 8);
      ctx.stroke();

      // Antenna lines
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy - 65);
      ctx.lineTo(cx - 30, cy - 80);
      ctx.moveTo(cx + 30, cy - 65);
      ctx.lineTo(cx + 30, cy - 80);
      ctx.stroke();

      // Active annotation lines
      ctx.strokeStyle = `rgba(23, 24, 23, ${hoverProgress * 0.4})`;
      ctx.beginPath();
      ctx.moveTo(cx + 35, cy - 20);
      ctx.lineTo(cx + 90, cy - 50);
      ctx.lineTo(cx + 120, cy - 50);
      ctx.stroke();

      ctx.font = '8px "Geist Mono", monospace';
      ctx.fillStyle = `rgba(23, 24, 23, ${hoverProgress})`;
      ctx.textAlign = 'left';
      ctx.fillText('CORE / SECURE_NODE_01', cx + 92, cy - 56);
      
      // Secondary annotation
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy + 60);
      ctx.lineTo(cx - 90, cy + 80);
      ctx.lineTo(cx - 120, cy + 80);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText('PWR / LIPO_CELL_720MAH', cx - 92, cy + 75);
    }

    // Subtle hover displacement rotation
    animationFrameId = requestAnimationFrame(draw);
  }

  draw();

  return () => {
    window.removeEventListener('resize', resize);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  };
}
export function initCorePulseVisual(canvasId = 'corepulseCanvas') {
  const canvas = document.getElementById(canvasId);

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let isHovered = false;
  let hoverProgress = 0;
  let time = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);

  const container = canvas.closest('.product-visual-container');
  if (container) {
    container.addEventListener('mouseenter', () => isHovered = true);
    container.addEventListener('mouseleave', () => isHovered = false);
  }

  // Nodes for Patient Information -> Workflow -> Coordination -> Action
  const nodes = [
    { id: 'input', label: 'INPUT', x: 0.15, y: 0.5 },
    { id: 'patient', label: 'PATIENT DATA', x: 0.38, y: 0.35 },
    { id: 'workflow', label: 'WORKFLOW', x: 0.38, y: 0.65 },
    { id: 'coordination', label: 'COORDINATION', x: 0.65, y: 0.5 },
    { id: 'action', label: 'ACTION', x: 0.85, y: 0.5 }
  ];

  function draw() {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    ctx.clearRect(0, 0, w, h);
    time += 0.02;

    // Hover progression
    if (isHovered) {
      hoverProgress += (1 - hoverProgress) * 0.1;
    } else {
      hoverProgress += (0 - hoverProgress) * 0.1;
    }

    // Grid rule backgrounds
    ctx.strokeStyle = 'rgba(23, 24, 23, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }

    // Convert normalized nodes to absolute
    const absNodes = nodes.map(n => ({
      ...n,
      x: n.x * w,
      y: n.y * h
    }));

    // Draw connections
    ctx.strokeStyle = 'rgba(23, 24, 23, 0.15)';
    ctx.lineWidth = 1;

    const drawConnection = (n1, n2) => {
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.stroke();

      // Pulsing data packet along connection lines
      const travel = (time % 2) / 2;
      const px = n1.x + (n2.x - n1.x) * travel;
      const py = n1.y + (n2.y - n1.y) * travel;

      ctx.fillStyle = '#171817';
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    };

    drawConnection(absNodes[0], absNodes[1]);
    drawConnection(absNodes[0], absNodes[2]);
    drawConnection(absNodes[1], absNodes[3]);
    drawConnection(absNodes[2], absNodes[3]);
    drawConnection(absNodes[3], absNodes[4]);

    // Render nodes & text
    absNodes.forEach(node => {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#171817';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner core node
      ctx.fillStyle = '#171817';
      ctx.beginPath();
      ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Interactive hover scale node
      if (hoverProgress > 0) {
        ctx.strokeStyle = `rgba(23, 24, 23, ${hoverProgress * 0.4})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8 + hoverProgress * 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.font = '8px "Geist Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y - 14);
    });

    animationFrameId = requestAnimationFrame(draw);
  }

  draw();

  return () => {
    window.removeEventListener('resize', resize);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  };
}

// One sophisticated technology visualization
export function initTechVisual() {
  const canvas = document.getElementById('techCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let resolved = false;
  let progress = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);

  const steps = [
    { label: 'HUMAN NEED', x: 0.15, y: 0.5 },
    { label: 'PERCEPTION', x: 0.35, y: 0.5 },
    { label: 'INTELLIGENCE', x: 0.55, y: 0.5 },
    { label: 'ACTION', x: 0.75, y: 0.5 },
    { label: 'SAFETY (GUARDIAN)', x: 0.9, y: 0.35 },
    { label: 'HEALTHCARE (COREPULSE)', x: 0.9, y: 0.65 }
  ];

  function draw() {
    if (resolved) return;

    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    ctx.clearRect(0, 0, w, h);

    progress += 0.008;
    if (progress >= 1) {
      progress = 1;
      resolved = true;
    }

    const absSteps = steps.map(s => ({
      ...s,
      x: s.x * w,
      y: s.y * h
    }));

    // Grid details
    ctx.strokeStyle = 'rgba(23, 24, 23, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 50) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }

    // Drawing paths sequentially
    ctx.strokeStyle = 'rgba(23, 24, 23, 0.6)';
    ctx.lineWidth = 1;

    const drawPath = (fromNode, toNode, currentProgress) => {
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(
        fromNode.x + (toNode.x - fromNode.x) * currentProgress,
        fromNode.y + (toNode.y - fromNode.y) * currentProgress
      );
      ctx.stroke();
    };

    // Sequenced draw
    if (progress > 0) {
      const p1 = Math.min(progress * 4, 1);
      drawPath(absSteps[0], absSteps[1], p1);
    }
    if (progress > 0.25) {
      const p2 = Math.min((progress - 0.25) * 4, 1);
      drawPath(absSteps[1], absSteps[2], p2);
    }
    if (progress > 0.5) {
      const p3 = Math.min((progress - 0.5) * 4, 1);
      drawPath(absSteps[2], absSteps[3], p3);
    }
    if (progress > 0.75) {
      const p4 = Math.min((progress - 0.75) * 4, 1);
      drawPath(absSteps[3], absSteps[4], p4);
      drawPath(absSteps[3], absSteps[5], p4);
    }

    // Render nodes
    absSteps.forEach((step, idx) => {
      const showNode = (idx === 0) || 
                       (idx === 1 && progress > 0.25) ||
                       (idx === 2 && progress > 0.5) ||
                       (idx === 3 && progress > 0.75) ||
                       ((idx === 4 || idx === 5) && progress >= 1.0);

      if (showNode) {
        ctx.fillStyle = '#171817';
        ctx.beginPath();
        ctx.arc(step.x, step.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '9px "Geist Mono", monospace';
        ctx.fillStyle = '#6F716D';
        ctx.textAlign = 'center';
        ctx.fillText(step.label, step.x, step.y - 12);
      }
    });

    animationFrameId = requestAnimationFrame(draw);
  }

  // Trigger draw once IntersectionObserver reveals section
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      draw();
      observer.disconnect();
    }
  }, { threshold: 0.1 });

  observer.observe(canvas);

  return () => {
    window.removeEventListener('resize', resize);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    observer.disconnect();
  };
}
