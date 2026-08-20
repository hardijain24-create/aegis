export function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let completed = false;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  
  resize();
  window.addEventListener('resize', resize);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startTime = Date.now();

  // Nodes for systems architecture
  const nodes = [
    { id: 'need', label: 'HUMAN NEED', sub: 'VAL_01_INPUT', x: 0.15, y: 0.5, desc: 'Sensing user presence/context' },
    { id: 'perception', label: 'PERCEPTION', sub: 'FIELD_RESOLVE', x: 0.35, y: 0.5, desc: 'High-fidelity sensory analysis' },
    { id: 'intelligence', label: 'INTELLIGENCE', sub: 'CORE_EVAL', x: 0.55, y: 0.5, desc: 'Processing threat/health parameters' },
    { id: 'action', label: 'ACTION', sub: 'SYS_EXECUTE', x: 0.75, y: 0.5, desc: 'Direct operations response' },
    { id: 'safety', label: 'SAFETY (GUARDIAN)', sub: 'SECURE_BRANCH', x: 0.9, y: 0.35, desc: 'Personal protection activation' },
    { id: 'healthcare', label: 'HEALTHCARE (COREPULSE)', sub: 'CLINICAL_FLOW', x: 0.9, y: 0.65, desc: 'Infrastructure coordination' }
  ];

  function draw() {
    if (completed && !prefersReducedMotion) return;

    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    ctx.clearRect(0, 0, w, h);

    let elapsed = (Date.now() - startTime) / 1000;
    if (prefersReducedMotion) {
      elapsed = 15.0; // Skip to complete state
    }

    // Grid background
    ctx.strokeStyle = 'rgba(23, 24, 23, 0.025)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let j = 0; j < h; j += 40) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
    }

    const T_CALM = 1.5;
    const T_CALC = 5.0;
    const T_FLOW = 9.0;
    const T_BRANCH = 12.0;
    const T_END = 14.0;

    // Convert coordinates to canvas absolute bounds
    const toAbs = (n) => ({
      x: n.x * w,
      y: n.y * h
    });

    const absNodes = nodes.map(n => ({ ...n, ...toAbs(n) }));

    // Phase 1: Calm (Empty space with subtle coordinate text)
    if (elapsed < T_CALM) {
      ctx.font = '8px "Geist Mono", monospace';
      ctx.fillStyle = 'rgba(23, 24, 23, 0.2)';
      ctx.textAlign = 'left';
      ctx.fillText(`SYS_CALIBRATE: RUNNING`, 40, 40);
      animationFrameId = requestAnimationFrame(draw);
      return;
    }

    // Phase 2: Calculation (Drawing structural outline rules & coordinates)
    const calcProgress = Math.min((elapsed - T_CALM) / (T_CALC - T_CALM), 1);
    
    // Draw horizontal axis line
    ctx.strokeStyle = `rgba(23, 24, 23, ${calcProgress * 0.08})`;
    ctx.beginPath();
    ctx.moveTo(absNodes[0].x - 50, absNodes[0].y);
    ctx.lineTo(absNodes[3].x + 50, absNodes[3].y);
    ctx.stroke();

    // Draw structural nodes coordinate targets
    absNodes.forEach((node, idx) => {
      if (idx > 3) return; // safety/healthcare are drawn in branching
      
      const opacity = calcProgress;
      ctx.strokeStyle = `rgba(23, 24, 23, ${opacity * 0.15})`;
      ctx.fillStyle = `rgba(23, 24, 23, ${opacity * 0.4})`;

      // Crosshairs on node center
      ctx.beginPath();
      ctx.moveTo(node.x - 10, node.y); ctx.lineTo(node.x + 10, node.y);
      ctx.moveTo(node.x, node.y - 10); ctx.lineTo(node.x, node.y + 10);
      ctx.stroke();

      // Dashed circle surrounding node
      ctx.save();
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Coordinates text
      ctx.font = '7px "Geist Mono", monospace';
      ctx.fillText(`[x:${Math.round(node.x)},y:${Math.round(node.y)}]`, node.x - 25, node.y - 15);
    });

    // Phase 3: Flow Activation (Sequential connections resolve)
    if (elapsed >= T_CALC) {
      const flowProgress = Math.min((elapsed - T_CALC) / (T_FLOW - T_CALC), 1);
      ctx.strokeStyle = 'rgba(23, 24, 23, 0.4)';
      ctx.lineWidth = 1;

      const drawPathSegment = (from, to, factor) => {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(from.x + (to.x - from.x) * factor, from.y + (to.y - from.y) * factor);
        ctx.stroke();

        // Pulsing data packet
        if (factor > 0.1 && factor < 0.95) {
          ctx.fillStyle = '#171817';
          ctx.beginPath();
          ctx.arc(from.x + (to.x - from.x) * factor, from.y + (to.y - from.y) * factor, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Sequenced flow between Need -> Perception -> Intelligence -> Action
      if (flowProgress > 0) {
        const seg1 = Math.min(flowProgress * 3, 1);
        drawPathSegment(absNodes[0], absNodes[1], seg1);
      }
      if (flowProgress > 0.33) {
        const seg2 = Math.min((flowProgress - 0.33) * 3, 1);
        drawPathSegment(absNodes[1], absNodes[2], seg2);
      }
      if (flowProgress > 0.66) {
        const seg3 = Math.min((flowProgress - 0.66) * 3, 1);
        drawPathSegment(absNodes[2], absNodes[3], seg3);
      }

      // Draw node headers
      absNodes.forEach((node, idx) => {
        if (idx > 3) return;
        const revealNode = (idx === 0) ||
                           (idx === 1 && flowProgress > 0.33) ||
                           (idx === 2 && flowProgress > 0.66) ||
                           (idx === 3 && flowProgress >= 1.0);

        if (revealNode) {
          ctx.fillStyle = '#171817';
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '9px "Geist Mono", monospace';
          ctx.fillText(node.label, node.x - 20, node.y + 20);
          ctx.font = '7px "Geist Mono", monospace';
          ctx.fillStyle = 'rgba(23, 24, 23, 0.5)';
          ctx.fillText(node.sub, node.x - 20, node.y + 30);
        }
      });
    }

    // Phase 4: Branching (Safety and Healthcare endpoints construct)
    if (elapsed >= T_FLOW) {
      const branchProgress = Math.min((elapsed - T_FLOW) / (T_BRANCH - T_FLOW), 1);
      ctx.strokeStyle = 'rgba(23, 24, 23, 0.4)';
      ctx.lineWidth = 1;

      // Draw branching paths from Action
      const actionNode = absNodes[3];
      const safetyNode = absNodes[4];
      const healthNode = absNodes[5];

      // Draw to safety (upward-right)
      ctx.beginPath();
      ctx.moveTo(actionNode.x, actionNode.y);
      ctx.lineTo(actionNode.x + (safetyNode.x - actionNode.x) * branchProgress, actionNode.y + (safetyNode.y - actionNode.y) * branchProgress);
      ctx.stroke();

      // Draw to healthcare (downward-right)
      ctx.beginPath();
      ctx.moveTo(actionNode.x, actionNode.y);
      ctx.lineTo(actionNode.x + (healthNode.x - actionNode.x) * branchProgress, actionNode.y + (healthNode.y - actionNode.y) * branchProgress);
      ctx.stroke();

      // Render endpoints when resolved
      if (branchProgress >= 0.95) {
        [safetyNode, healthNode].forEach((node) => {
          ctx.fillStyle = '#171817';
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
          ctx.fill();

          // Highlight target circles
          ctx.strokeStyle = 'rgba(23, 24, 23, 0.2)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
          ctx.stroke();

          ctx.font = '10px "Geist", sans-serif';
          ctx.font = 'bold 9px "Geist", sans-serif';
          ctx.fillText(node.label, node.x + 18, node.y + 3);
          ctx.font = '7px "Geist Mono", monospace';
          ctx.fillStyle = 'rgba(23, 24, 23, 0.5)';
          ctx.fillText(node.sub, node.x + 18, node.y + 12);
        });
      }
    }

    // Phase 5: Stillness & Stop
    if (elapsed >= T_END) {
      completed = true;
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  draw();

  return () => {
    window.removeEventListener('resize', resize);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  };
}
