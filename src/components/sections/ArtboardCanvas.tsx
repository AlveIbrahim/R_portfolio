import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

// Parallax factors per column - creates vertical speed variation like nicolaromei.com
// These repeat for infinite columns using modulo
const PARALLAX_FACTORS = [0.6, 1.0, 0.8, 1.4, 0.7, 1.2, 0.9, 1.3];

const ASSETS = [
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/6952ae8502127800ad2dc8f8_retromob.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/69539f7e723783fb2223b441_oakley.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/694afe41adad0bd9f3ce7b3f_CREATIVE.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/6954f072f0a84f88c1608386_ROBOT.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/694fc10b08a404815af1c082_retro__col.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/695e59f71613a2270aa4c912_fashion-retro.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/6954f278b16b2664ea9350dd_visionary.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/69539f725df609a677956f2a_mountain%20p3.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/694afe56d26fc3eba7ef6816_VALSA.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/69296c87e425fc2eb31b5029_helix-min.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/6954f10217d21ebf549041f2_Hero.avif"
];

const ArtboardCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  // Performance Optimization: Use refs for high-frequency updates (60fps)
  // This avoids React re-renders during drag operations
  const offsetRef = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  
  // Inertia/momentum physics
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastMoveTime = useRef(performance.now());
  const FRICTION = 0.92; // Deceleration factor (lower = faster stop)
  const MIN_VELOCITY = 0.1; // Stop when velocity drops below this

  // Coarse-grained state for virtualization (only updates when grid items need to change)
  const [visibleBounds, setVisibleBounds] = useState({ minC: 0, maxC: 0, minR: 0, maxR: 0 });
  const lastBoundsRef = useRef({ minC: 0, maxC: 0, minR: 0, maxR: 0 });
  
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    setIsMounted(true);

    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      setIsMobile(window.innerWidth < 768);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Dynamically calculate visible grid items for infinite feel
    // Optimized to only re-calculate when visibleBounds change (coarse updates)
    // Now stores column index (c) for parallax calculation
    const gridItems = useMemo(() => {
      if (dimensions.width === 0) return [];
      
      const cellW = isMobile ? 200 : 500;
      const cellH = isMobile ? 260 : 650;
      
      const { minC, maxC, minR, maxR } = visibleBounds;

      const items = [];
      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          // Deterministic asset selection based on grid coordinates
          const assetIndex = Math.abs((r * 7 + c * 13) % ASSETS.length);
          items.push({
            id: `${r}-${c}`,
            src: ASSETS[assetIndex],
            x: c * cellW,
            baseY: r * cellH, // Base Y position without parallax
            col: c, // Store column index for parallax factor lookup
          });
        }
      }
      return items;
    }, [visibleBounds, dimensions, isMobile]);

  const imageWidth = isMobile ? 180 : 480;
  const imageHeight = isMobile ? 240 : 630;

  // Unified Move Handler (Touch + Mouse)
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    
    const now = performance.now();
    const dt = now - lastMoveTime.current;
    
    const dx = clientX - lastMousePos.current.x;
    const dy = clientY - lastMousePos.current.y;
    
    // Update ref directly - no re-render
    offsetRef.current.x += dx;
    offsetRef.current.y += dy;
    
    // Calculate velocity for inertia (pixels per ms, scaled up)
    if (dt > 0) {
      velocityRef.current.x = dx / dt * 16; // Scale to ~60fps frame time
      velocityRef.current.y = dy / dt * 16;
    }
    
    lastMousePos.current = { x: clientX, y: clientY };
    lastMoveTime.current = now;
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    lastMousePos.current = { x: clientX, y: clientY };
    lastMoveTime.current = performance.now();
    // Stop any existing inertia when starting a new drag
    velocityRef.current = { x: 0, y: 0 };
    if (itemsContainerRef.current) {
        itemsContainerRef.current.style.transition = 'none';
    }
  }, []);

  const handleEnd = useCallback(() => {
    isDraggingRef.current = false;
    // Inertia continues in render loop - no transition needed
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    // e.preventDefault(); // Moved to passive: false in effect if needed, but React handles this.
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }, [handleMove]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  // Main Render Loop (Canvas + DOM Transform + Virtualization Check)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparency if possible
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const render = (time: number) => {
      // FPS Monitoring
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = time;
      }

      // 1. Sync Canvas Size
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      // 2. Clear & Draw Background
      // Use offsetRef.current directly
      const offset = offsetRef.current;
      const velocity = velocityRef.current;
      
      // Apply inertia when not dragging
      if (!isDraggingRef.current) {
        if (Math.abs(velocity.x) > MIN_VELOCITY || Math.abs(velocity.y) > MIN_VELOCITY) {
          offset.x += velocity.x;
          offset.y += velocity.y;
          velocity.x *= FRICTION;
          velocity.y *= FRICTION;
          
          // Stop completely when velocity is very small
          if (Math.abs(velocity.x) < MIN_VELOCITY) velocity.x = 0;
          if (Math.abs(velocity.y) < MIN_VELOCITY) velocity.y = 0;
        }
      }
      
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Draw Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      const gridSize = 100;
      // Use modulus with positive result adjustment
      const startX = (offset.x % gridSize) - gridSize; 
      const startY = (offset.y % gridSize) - gridSize;

      // Vertical lines
      // Optimize loop bounds
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.beginPath();
      for (let x = startX; x < w + gridSize; x += gridSize) {
        ctx.moveTo(Math.floor(x) + 0.5, 0); // Pixel perfect lines
        ctx.lineTo(Math.floor(x) + 0.5, h);
      }
      ctx.stroke();

      // Horizontal lines
      ctx.beginPath();
      for (let y = startY; y < h + gridSize; y += gridSize) {
        ctx.moveTo(0, Math.floor(y) + 0.5);
        ctx.lineTo(w, Math.floor(y) + 0.5);
      }
      ctx.stroke();

        // 4. Update Container Transform (Direct DOM Manipulation)
        // X offset applied to container, Y offset applied per-item for parallax
        if (itemsContainerRef.current) {
          // Only apply X translation to container - Y is handled per-item
          itemsContainerRef.current.style.transform = `translate3d(${offset.x}px, 0, 0)`;
        }

        // 4b. Update each item's Y position with parallax factor
        // Each column moves at different vertical speed based on PARALLAX_FACTORS
        const itemElements = itemsContainerRef.current?.querySelectorAll('[data-parallax-col]');
        itemElements?.forEach((el) => {
          const col = parseInt(el.getAttribute('data-parallax-col') || '0', 10);
          const baseY = parseFloat(el.getAttribute('data-base-y') || '0');
          // Use modulo to repeat parallax factors for infinite columns
          const parallaxIndex = ((col % PARALLAX_FACTORS.length) + PARALLAX_FACTORS.length) % PARALLAX_FACTORS.length;
          const factor = PARALLAX_FACTORS[parallaxIndex];
          const parallaxY = baseY + (offset.y * factor);
          (el as HTMLElement).style.transform = `translate3d(0, ${parallaxY}px, 0)`;
        });

      // 5. Virtualization Logic (Coarse-grained)
      // Only trigger React state update if grid bounds change
      const cellW = isMobile ? 200 : 500;
      const cellH = isMobile ? 260 : 650;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const buffer = 1;
      
      // For parallax, we need extra buffer on Y axis since items move at different speeds
      // Use max parallax factor to ensure we render enough items
      const maxParallax = Math.max(...PARALLAX_FACTORS);
      const minParallax = Math.min(...PARALLAX_FACTORS);
      const parallaxBuffer = 2; // Extra rows for parallax safety

      const newMinC = Math.floor((-offset.x - centerX) / cellW) - buffer;
      const newMaxC = Math.ceil((window.innerWidth - offset.x - centerX) / cellW) + buffer;
      // Adjust row bounds for parallax - consider both fast and slow moving columns
      const newMinR = Math.floor((-offset.y * maxParallax - centerY) / cellH) - buffer - parallaxBuffer;
      const newMaxR = Math.ceil((window.innerHeight - offset.y * minParallax - centerY) / cellH) + buffer + parallaxBuffer;

      const lb = lastBoundsRef.current;
      if (newMinC !== lb.minC || newMaxC !== lb.maxC || newMinR !== lb.minR || newMaxR !== lb.maxR) {
        lastBoundsRef.current = { minC: newMinC, maxC: newMaxC, minR: newMinR, maxR: newMaxR };
        setVisibleBounds({ minC: newMinC, maxC: newMaxC, minR: newMinR, maxR: newMaxR });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render(performance.now());
    return () => cancelAnimationFrame(animationFrameId);
  }, [isMobile]); // Restart loop if layout config changes

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#0a0a0a] cursor-grab active:cursor-grabbing select-none touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
    >
      {/* WebGL Emulated Background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Interactive Item Overlay */}
      <div 
        ref={itemsContainerRef}
        className="absolute inset-0 z-10 will-change-transform" // Hint to browser
        style={{
           // Initial transform set by ref, but we can set initial style here too
           transform: 'translate3d(0px, 0px, 0)',
           // Transition handled in JS logic or kept minimal
        }}
      >
            <div className="relative w-full h-full">
                {gridItems.map((item) => (
                  <div
                    key={item.id}
                    data-parallax-col={item.col}
                    data-base-y={dimensions.height / 2 + item.baseY}
                    className="absolute group overflow-hidden border border-white/5 bg-neutral-900 will-change-transform"
                    style={{
                      left: `${dimensions.width / 2 + item.x}px`,
                      top: 0,
                      transform: `translate3d(0, ${dimensions.height / 2 + item.baseY}px, 0)`,
                      width: `${imageWidth}px`,
                      height: `${imageHeight}px`,
                      contentVisibility: 'auto',
                      contain: 'paint layout'
                    }}
                    onMouseEnter={() => setHoveredIndex(item.id)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={item.src}
                    alt="Project Item"
                    loading="eager" // Load visible items eagerly
                    className={`w-full h-full object-cover transition-all duration-700 ease-in-out scale-105 group-hover:scale-100 ${
                      hoveredIndex === item.id ? 'grayscale-0' : 'grayscale'
                    }`}
                    draggable={false}
                    style={{
                      willChange: 'filter, transform' // Optimize hover effect
                    }}
                  />
                  {/* CRT Screen Scanlines for individual items */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.04),rgba(0,0,255,0.06))] bg-[length:100%_2px,2px_100%]" />
                </div>
              </div>
            ))}
          </div>

      </div>

      {/* CRT Master Overlay */}
      <div className="crt-overlay pointer-events-none fixed inset-0 z-[9999]" />
      <div className="grain-texture pointer-events-none fixed inset-0 z-[9998]" />

      {/* Progressive Blur Panels */}
      <div className="progressive-blur_wrap is--top fixed top-0 left-0 w-full z-[100] pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={`blur-t-${i}`} 
            className={`blur-panel blur-top h-[2vh]`} 
            style={{ 
              backdropFilter: `blur(${i + 1}px)`,
              opacity: (i + 1) / 10 
            }}
          />
        ))}
      </div>
      
      <div className="progressive-blur_wrap is--bottom fixed bottom-0 left-0 w-full z-[100] pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={`blur-b-${i}`} 
            className={`blur-panel blur-bottom h-[2vh]`} 
            style={{ 
              backdropFilter: `blur(${10 - i}px)`,
              opacity: (10 - i) / 10 
            }}
          />
        ))}
      </div>

      {/* HUD Information Overlay */}
      <div className="absolute bottom-[5vh] left-[5vh] md:left-[5vh] left-[3vh] z-50 pointer-events-none">
        <div className="flex flex-col gap-2">
            <div className="text-ui opacity-60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              LIVE CANVAS {process.env.NODE_ENV === 'development' && <span className="text-xs ml-2">FPS: {fps}</span>}
            </div>
          <p className="text-ui max-w-[300px] md:max-w-[300px] max-w-[200px] leading-relaxed text-[9px] md:text-[11px]">
            SCROLL / DRAG TO INTERACT W/ THE CANVAS™
          </p>
        </div>
      </div>

    </div>
  );
};

export default ArtboardCanvas;
