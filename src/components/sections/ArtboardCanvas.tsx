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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [blinkMap, setBlinkMap] = useState<boolean[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const text = "the artboard™";
    setBlinkMap(text.split('').map(() => Math.random() > 0.8));
  }, []);

  // Generate a larger grid of images for infinite-like feel
  const gridItems = useMemo(() => {
    const items = [];
    const cols = 5;
    const rows = 5;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const assetIndex = (r * cols + c) % ASSETS.length;
        items.push({
          id: `${r}-${c}`,
          src: ASSETS[assetIndex],
          x: c * 400 - 800,
          y: r * 500 - 1000,
        });
      }
    }
    return items;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

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

      // We handle actual image drawing via DOM elements for pixel-perfect filter control 
      // as per design requirements (grayscale filter/interactivity).
      // The canvas here serves as the WebGL-esque background & grid coordinator.
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
          {gridItems.map((item, idx) => (
            <div
              key={item.id}
              className="absolute group overflow-hidden border border-white/5 bg-neutral-900"
              style={{
                left: `${canvasRef.current ? canvasRef.current.width / 2 + item.x : item.x}px`,
                top: `${canvasRef.current ? canvasRef.current.height / 2 + item.y : item.y}px`,
                width: '320px',
                height: '400px',
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={item.src}
                  alt="Project Item"
                  className={`w-full h-full object-cover transition-all duration-700 ease-in-out scale-105 group-hover:scale-100 ${
                    hoveredIndex === idx ? 'grayscale-0' : 'grayscale'
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
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            LIVE ARTBOARD_SESSION
          </div>
          <p className="text-ui max-w-[300px] leading-relaxed">
            SCROLL / DRAG TO INTERACT W/ THE ARTBOARD™
          </p>
        </div>
      </div>

      {/* Fixed Large Background Text */}
      <div className="absolute bottom-10 right-10 z-20 pointer-events-none select-none">
        <h1 className="font-array text-[8vw] leading-none text-white/5 flex gap-[0.2em]">
          {"the artboard™".split('').map((char, i) => (
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