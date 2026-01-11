"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

/**
 * InfoTab Component
 * 
 * A collapsible informational tab that appears over the artboard.
 * Features:
 * - Background video loop (or placeholder image) inside an iPhone frame.
 * - Detailed instruction text with intentional spanning.
 * - Character-staggered "CLOSE" button.
 * - Integrates with the overall minimalist brutalist aesthetic.
 */

export default function InfoTab() {
  const [isOpen, setIsOpen] = useState(true);

  // Close the tab
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-[140px] right-8 z-[100] w-full max-w-[480px] md:max-w-[560px] pointer-events-auto">
      <div className="hero__tab bg-[#e8e8e8] border border-[#d1d1d1] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Visual Section: iPhone Frame + Video Loop */}
        <div className="tab__video relative w-full md:w-[240px] h-[300px] md:h-auto overflow-hidden bg-[#d1d1d1]">
          <div className="tab__demo relative w-full h-full flex items-center justify-center p-6">
            <div className="bunny-bg relative w-full h-full flex items-center justify-center">
              {/* iPhone Frame Asset */}
              <Image
                src="https://cdn.prod.website-files.com/6928a718958d854622ebb4f7/69450a856a28f12fd88f17ac_imgi_5_693ada0d9f879dafcd0bab03_iphone-min.avif"
                alt="Nicola Romei Digital Designer portfolio experience explanation"
                width={200}
                height={400}
                className="relative z-10 w-auto h-full object-contain pointer-events-none"
              />
              
              {/* Video Mock/Placeholder (Typically a blob or streaming source in original) */}
              <div className="absolute inset-x-[15%] inset-y-[8%] z-0 rounded-[2rem] overflow-hidden bg-black flex items-center justify-center">
                 <div className="w-full h-full bg-neutral-900 animate-pulse flex items-center justify-center">
                    <span className="text-[10px] text-neutral-500 font-mono italic">LOADING_PREVIEW</span>
                 </div>
              </div>
            </div>
            {/* Fade effect on the side */}
            <div className="demo-section__fade-left absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#e8e8e8] to-transparent pointer-events-none z-20 hidden md:block" />
          </div>
        </div>

        {/* Description Section */}
        <div className="tab__desc p-8 flex flex-col justify-between flex-1 border-t md:border-t-0 md:border-l border-[#d1d1d1]">
          <div className="mb-8">
            <p className="paragraph font-display text-[0.875rem] leading-[1.5] text-[#1a1a1a] uppercase tracking-[0.05em]">
              SCROLL / DRAG <span className="text-[#7c7c7c]">TO INTERACT W/ </span>THE ARTBOARD
              <span className="text-[#7c7c7c]"> </span>
              <span className="italic normal-case font-serif text-[1rem]">or</span> 
              <span className="text-[#1a1a1a]"> click on the grid </span>
              <span className="text-[#7c7c7c]">to explore </span>
              <span>the archive.</span>
              <br />
              <br />
              <span className="text-[0.75rem] leading-[1.6] opacity-80">
                THE ARTBOARD SERVES AS A STRUCTURED ENVIRONMENT WHERE CREATIONS, SYSTEMS, AND DESIGN RESEARCH ACCUMULATED OVER TIME ARE ORGANIZED, PRESERVED, AND CONTINUOUSLY REVISITED.
              </span>
            </p>
          </div>

          {/* Staggered "CLOSE" Button */}
          <button
            onClick={handleClose}
            aria-label="staggering button"
            className="group relative flex items-center justify-center w-full h-[50px] border border-[#1a1a1a] transition-colors duration-300 hover:bg-[#1a1a1a]"
          >
            <div className="btn-animate-chars__bg absolute inset-0 bg-[#1a1a1a] scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
            <span className="relative z-10 font-display font-bold text-[0.75rem] tracking-[0.2em] text-[#1a1a1a] group-hover:text-[#e8e8e8] flex gap-[2px]">
              {["C", "L", "O", "S", "E"].map((char, i) => (
                <span 
                  key={i} 
                  className="inline-block transition-transform duration-300 group-hover:animate-blink"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {char}
                </span>
              ))}
            </span>
          </button>
        </div>
      </div>

      {/* Embedded CSS for the specific animations if needed via Tailwind isn't enough */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0.3; transform: translateY(-1px); }
        }
        .animate-blink {
          animation: blink 0.6s infinite;
        }
      `}</style>
    </div>
  );
}

/**
 * Usage Note:
 * This component should be rendered within the main layout where the artboard exists.
 * It follows the specific sizing and interactive patterns from the nicolaromei.com archive tab.
 */