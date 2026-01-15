import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

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

const COLUMN_SPEEDS = [0.6, 0.85, 1.0, 1.15, 0.75, 0.95, 1.1, 0.7, 0.9, 1.05];

const ArtboardCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const baseOffsetRef = useRef({ x: 0, y: 0 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  const columnOffsetsRef = useRef<number[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const velocityRef = useRef({ x: 0, y: 0 });

  const [visibleBounds, setVisibleBounds] = useState({ minC: 0, maxC: 0, minR: 0, maxR: 0 });
  const lastBoundsRef = useRef({ minC: 0, maxC: 0, minR: 0, maxR: 0 });
  
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fps, setFps] = useState(60);

  const cellW = isMobile ? 200 : 500;
  const cellH = isMobile ? 260 : 650;
  const imageWidth = isMobile ? 180 : 480;
  const imageHeight = isMobile ? 240 : 630;

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

  const gridItems = useMemo(() => {
    if (dimensions.width === 0) return [];
    
    const { minC, maxC, minR, maxR } = visibleBounds;
    const items = [];
    
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        const assetIndex = Math.abs((r * 7 + c * 13) % ASSETS.length);
        items.push({
          id: `${r}-${c}`,
          src: ASSETS[assetIndex],
          row: r,
          col: c,
          baseX: c * cellW,
          baseY: r * cellH,
        });
      }
    }
    return items;
  }, [visibleBounds, dimensions, isMobile, cellW, cellH]);

  const getColumnSpeed = useCallback((col: number) => {
    const normalizedCol = ((col % COLUMN_SPEEDS.length) + COLUMN_SPEEDS.length) % COLUMN_SPEEDS.length;
    return COLUMN_SPEEDS[normalizedCol];
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    
    const dx = clientX - lastMousePos.current.x;
    const dy = clientY - lastMousePos.current.y;
    
    velocityRef.current = { x: dx * 0.5, y: dy * 0.5 };
    
    targetOffsetRef.current.x += dx;
    targetOffsetRef.current.y += dy;
    
    lastMousePos.current = { x: clientX, y: clientY };
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    lastMousePos.current = { x: clientX, y: clientY };
    velocityRef.current = { x: 0, y: 0 };
  }, []);

  const handleEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }, [handleMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = (time: number) => {
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = time;
      }

      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      if (!isDraggingRef.current) {
        targetOffsetRef.current.x += velocityRef.current.x;
        targetOffsetRef.current.y += velocityRef.current.y;
        velocityRef.current.x *= 0.95;
        velocityRef.current.y *= 0.95;
        if (Math.abs(velocityRef.current.x) < 0.1) velocityRef.current.x = 0;
        if (Math.abs(velocityRef.current.y) < 0.1) velocityRef.current.y = 0;
      }

      const easeFactor = isDraggingRef.current ? 0.3 : 0.08;
      currentOffsetRef.current.x = lerp(currentOffsetRef.current.x, targetOffsetRef.current.x, easeFactor);
      currentOffsetRef.current.y = lerp(currentOffsetRef.current.y, targetOffsetRef.current.y, easeFactor);

      const offset = currentOffsetRef.current;
      
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      const gridSize = 100;
      const startX = (offset.x % gridSize) - gridSize; 
      const startY = (offset.y % gridSize) - gridSize;

      const w = canvas.width;
      const h = canvas.height;
      
      ctx.beginPath();
      for (let x = startX; x < w + gridSize; x += gridSize) {
        ctx.moveTo(Math.floor(x) + 0.5, 0);
        ctx.lineTo(Math.floor(x) + 0.5, h);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let y = startY; y < h + gridSize; y += gridSize) {
        ctx.moveTo(0, Math.floor(y) + 0.5);
        ctx.lineTo(w, Math.floor(y) + 0.5);
      }
      ctx.stroke();

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      itemRefs.current.forEach((element, id) => {
        const [rowStr, colStr] = id.split('-');
        const row = parseInt(rowStr);
        const col = parseInt(colStr);
        
        const colSpeed = getColumnSpeed(col);
        
        const itemX = centerX + col * cellW + offset.x;
        const itemY = centerY + row * cellH + offset.y * colSpeed;
        
        element.style.transform = `translate3d(${itemX}px, ${itemY}px, 0)`;
      });

      const buffer = 1;
      const newMinC = Math.floor((-offset.x - centerX) / cellW) - buffer;
      const newMaxC = Math.ceil((window.innerWidth - offset.x - centerX) / cellW) + buffer;
      const newMinR = Math.floor((-offset.y - centerY) / cellH) - buffer;
      const newMaxR = Math.ceil((window.innerHeight - offset.y - centerY) / cellH) + buffer;

      const lb = lastBoundsRef.current;
      if (newMinC !== lb.minC || newMaxC !== lb.maxC || newMinR !== lb.minR || newMaxR !== lb.maxR) {
        lastBoundsRef.current = { minC: newMinC, maxC: newMaxC, minR: newMinR, maxR: newMaxR };
        setVisibleBounds({ minC: newMinC, maxC: newMaxC, minR: newMinR, maxR: newMaxR });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render(performance.now());
    return () => cancelAnimationFrame(animationFrameId);
  }, [isMobile, cellW, cellH, getColumnSpeed]);

  const setItemRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
    } else {
      itemRefs.current.delete(id);
    }
  }, []);

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
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div className="absolute inset-0 z-10 pointer-events-none">
        {gridItems.map((item) => (
          <div
            key={item.id}
            ref={(el) => setItemRef(item.id, el)}
            className="absolute group overflow-hidden border border-white/5 bg-neutral-900 will-change-transform pointer-events-auto"
            style={{
              width: `${imageWidth}px`,
              height: `${imageHeight}px`,
              left: 0,
              top: 0,
              contentVisibility: 'auto',
              contain: 'paint layout',
            }}
            onMouseEnter={() => setHoveredIndex(item.id)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={item.src}
                alt="Project Item"
                loading="eager"
                className={`w-full h-full object-cover transition-all duration-700 ease-in-out scale-105 group-hover:scale-100 ${
                  hoveredIndex === item.id ? 'grayscale-0' : 'grayscale'
                }`}
                draggable={false}
                style={{
                  willChange: 'filter, transform'
                }}
              />
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.04),rgba(0,0,255,0.06))] bg-[length:100%_2px,2px_100%]" />
            </div>
          </div>
        ))}
      </div>

      <div className="crt-overlay pointer-events-none fixed inset-0 z-[9999]" />
      <div className="grain-texture pointer-events-none fixed inset-0 z-[9998]" />

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

      <div className="absolute bottom-[5vh] left-[3vh] md:left-[5vh] z-50 pointer-events-none">
        <div className="flex flex-col gap-2">
          <div className="text-ui opacity-60 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            LIVE CANVAS {process.env.NODE_ENV === 'development' && <span className="text-xs ml-2">FPS: {fps}</span>}
          </div>
          <p className="text-ui max-w-[200px] md:max-w-[300px] leading-relaxed text-[9px] md:text-[11px]">
            SCROLL / DRAG TO INTERACT W/ THE CANVAS™
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtboardCanvas;
