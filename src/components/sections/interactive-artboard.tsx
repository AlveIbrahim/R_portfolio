import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const ASSETS = [
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/6952ae8502127800ad2dc8f8_retromob.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/69539f7e723783fb2223b441_oakley.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/694afe41adad0bd9f3ce7b3f_CREATIVE.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/6954ec299bb8e35d95065bc7_img2-min%20(2).avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/694fbf914be1cfd61761a2b2_nicola_romei_alpine_valley_landscape_rough.avif",
  "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/695e59f71613a2270aa4c912_fashion-retro.avif"
];

const InteractiveArtboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        timeZone: 'Europe/Rome' 
      });
      setCurrentTime(`${timeString} GMT+1`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  // Replicating the 4-column structure from the high-level design
  return (
    <main 
      ref={containerRef} 
      className="relative min-h-screen bg-[#e8e8e8] overflow-hidden select-none cursor-none"
      onMouseMove={handleMouseMove}
    >
      {/* CRT Overlay Section */}
      <div className="crt-overlay fixed inset-0 z-[9999] pointer-events-none" />

      {/* Progressive Blur Headers/Footers */}
      <div className="blur-edge-top" />
      <div className="blur-edge-bottom" />

      {/* Navigation Layer - 4 Column Hero Grid */}
      <nav className="fixed top-0 left-0 w-full p-8 z-40 grid grid-cols-1 md:grid-cols-4 gap-8 pointer-events-none *:pointer-events-auto">
        <div className="space-y-4">
          <p className="text-[0.75rem] leading-[1.4] font-body uppercase tracking-[0.05em]">
            Based in Italy,<br />working globally.
          </p>
          <p className="text-[0.75rem] font-mono opacity-80">{currentTime}</p>
        </div>

        <div className="space-y-2">
          <p className="text-tag">(my.expertise)</p>
          <div className="space-y-1">
            <p className="text-[0.75rem] font-body font-bold uppercase tracking-wider">Art Direction</p>
            <p className="text-[0.75rem] font-body font-bold uppercase tracking-wider">Web Design + Dev</p>
            <p className="text-[0.75rem] font-body font-bold uppercase tracking-wider">Webflow Development</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-tag">(social.contacts)</p>
          <div className="flex flex-col space-y-1">
            <a href="https://www.awwwards.com/nicolaromei/" className="text-[0.75rem] font-body font-bold uppercase tracking-wider underline decoration-[#d1d1d1] underline-offset-4 hover:decoration-black transition-colors">Awwwards</a>
            <a href="https://www.linkedin.com/in/nicolaromei/" className="text-[0.75rem] font-body font-bold uppercase tracking-wider underline decoration-[#d1d1d1] underline-offset-4 hover:decoration-black transition-colors">LinkedIn</a>
            <a href="mailto:info@nicolaromei.com" className="text-[0.75rem] font-body font-bold uppercase tracking-wider underline decoration-[#d1d1d1] underline-offset-4 hover:decoration-black transition-colors">Contacts</a>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <p className="text-[1.125rem] font-display font-bold leading-tight uppercase tracking-[-0.01em]">
            Digital Experience Designer and Awwwards Judge. I create immersive websites defined by strong visual direction, refined motion, and a distinct design signature.
          </p>
          <div className="flex gap-4 mt-8">
            <a href="/the-archive" className="flex-1 py-3 px-6 border-interface text-center text-[0.875rem] font-display font-bold tracking-[0.12em] uppercase hover:bg-black hover:text-white transition-all duration-300 group overflow-hidden relative">
              <span className="relative z-10">The Archive</span>
            </a>
            <a href="/the-profile" className="flex-1 py-3 px-6 border-interface text-center text-[0.875rem] font-display font-bold tracking-[0.12em] uppercase hover:bg-black hover:text-white transition-all duration-300 group overflow-hidden relative">
              <span className="relative z-10">The Profile</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Artboard Canvas Mockup (WebGL placeholder behavior) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#d1d1d1] w-full h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-[#e8e8e8] relative group overflow-hidden cursor-none">
              <a href="/archive" className="w-full h-full block">
                <Image 
                  src={ASSETS[i % ASSETS.length]} 
                  alt={`Archived Artwork ${i}`}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out grayscale hover:grayscale-0"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Info Tab Wrap */}
      <div className={`fixed bottom-0 left-0 w-full transition-transform duration-700 ease-in-out z-50 ${isGridOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-white border-t border-interface p-12 max-w-2xl mx-auto mb-12 shadow-2xl">
          <div className="space-y-6">
            <p className="text-[1rem] font-body leading-relaxed uppercase">
              SCROLL / DRAG <span className="text-[#a3a3a3]">TO INTERACT W/</span> THE ARTBOARD <span className="italic text-[#7c7c7c]">or</span> CLICK ON THE GRID <span className="text-[#a3a3a3]">TO EXPLORE</span> THE ARCHIVE.
            </p>
            <p className="text-[0.75rem] font-mono text-[#7c7c7c]">
              THE ARTBOARD SERVES AS A STRUCTURED ENVIRONMENT WHERE CREATIONS, SYSTEMS, AND DESIGN RESEARCH ACCUMULATED OVER TIME ARE ORGANIZED, PRESERVED, AND CONTINUOUSLY REVISITED.
            </p>
            <button 
              onClick={() => setIsGridOpen(false)}
              className="w-full py-4 border-interface text-[0.875rem] font-display font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="fixed bottom-0 left-0 w-full p-8 z-40 pointer-events-none flex justify-between items-end">
        <h1 className="text-[2.5rem] font-display font-semibold tracking-[-0.02em] uppercase leading-none">
          the artboard<span className="animate-blink">™</span>
        </h1>
        <button 
          onClick={() => setIsGridOpen(true)}
          className="pointer-events-auto bg-black text-white px-4 py-2 text-[0.65rem] font-mono tracking-widest uppercase"
        >
          [info.sys]
        </button>
      </div>

      {/* Custom Cursor */}
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference"
        style={{ 
          transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full border border-white" />
          <div className="mt-4 whitespace-nowrap overflow-hidden">
             <span className="block text-[0.65rem] font-mono text-white tracking-[0.2em] font-bold uppercase animate-pulse">
               CLICK TO EXPLORE
             </span>
          </div>
        </div>
      </div>

      {/* Global CSS Injectable for specific keyframes */}
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .crt-overlay::before {
          content: "";
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.05) 50%), 
                      linear-gradient(90deg, rgba(255,0,0,0.01), rgba(0,255,0,0.005), rgba(0,0,255,0.01));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
      `}</style>
    </main>
  );
};

export default InteractiveArtboard;