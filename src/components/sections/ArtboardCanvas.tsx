import React, { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';

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
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [isMounted, setIsMounted] = useState(false);
  const [blinkMap, setBlinkMap] = useState<boolean[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const text = "the canvas™";
    setBlinkMap(text.split('').map(() => Math.random() > 0.8));

    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Dynamically calculate visible grid items for infinite feel
  const gridItems = useMemo(() => {
    if (dimensions.width === 0) return [];
    
    const cellW = 400;
    const cellH = 500;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Buffer to prevent popping
    const buffer = 1;
    const minC = Math.floor((-offset.x - centerX) / cellW) - buffer;
    const maxC = Math.ceil((dimensions.width - offset.x - centerX) / cellW) + buffer;
    const minR = Math.floor((-offset.y - centerY) / cellH) - buffer;
    const maxR = Math.ceil((dimensions.height - offset.y - centerY) / cellH) + buffer;

    const items = [];
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        // Deterministic asset selection based on grid coordinates
        const assetIndex = Math.abs((r * 7 + c * 13) % ASSETS.length);
        items.push({
          id: `${r}-${c}`,
          src: ASSETS[assetIndex],
          x: c * cellW,
          y: r * cellH,
        });
      }
    }
    return items;
  }, [offset, dimensions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Lines (Background)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      const gridSize = 100;
      const startX = (offset.x % gridSize) - gridSize;
      const startY = (offset.y % gridSize) - gridSize;

      for (let x = startX; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = startY; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [offset]);


  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-[#0a0a0a] cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* WebGL Emulated Background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Interactive Item Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
          <div className="relative w-full h-full">
            {gridItems.map((item) => (
              <div
                key={item.id}
                className="absolute group overflow-hidden border border-white/5 bg-neutral-900"
                style={{
                  left: `${dimensions.width / 2 + item.x}px`,
                  top: `${dimensions.height / 2 + item.y}px`,
                  width: '320px',
                  height: '400px',
                }}
                onMouseEnter={() => setHoveredIndex(item.id)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={item.src}
                    alt="Project Item"
                    className={`w-full h-full object-cover transition-all duration-700 ease-in-out scale-105 group-hover:scale-100 ${
                      hoveredIndex === item.id ? 'grayscale-0' : 'grayscale'
                    }`}
                    draggable={false}
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
      <div className="absolute bottom-[5vh] left-[5vh] z-50 pointer-events-none">
        <div className="flex flex-col gap-2">
            <div className="text-ui opacity-60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              LIVE CANVAS
            </div>
          <p className="text-ui max-w-[300px] leading-relaxed">
            SCROLL / DRAG TO INTERACT W/ THE CANVAS™
          </p>
        </div>
      </div>

      {/* Fixed Large Background Text */}
      <div className="absolute inset-0 z-20 pointer-events-none select-none flex items-center justify-center">
        <h1 className="font-array text-[8vw] leading-none text-white/5 flex gap-[0.2em]">
          {"the canvas™".split('').map((char, i) => (
            <span key={i} className={blinkMap[i] ? "animate-blink opacity-50" : ""}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
};

export default ArtboardCanvas;