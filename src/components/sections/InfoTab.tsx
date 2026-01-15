"use client";

import React, { useState } from 'react';
import Image from 'next/image';

/**
 * InfoTab Component
 * 
 * Clones the bottom-right information tab from the artboard section.
 * Includes a background image/placeholder element, description text, 
 * and a toggle-able "Close" button.
 */
export default function InfoTab() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-[1.25rem] right-[1.25rem] z-[50] w-full max-w-[400px]">
      <div className="hero__tab-wrap flex flex-col items-end">
        {/* Tab Container */}
        <div className="hero__tab bg-[#0a0a0a] border border-[#262626] overflow-hidden flex flex-col shadow-2xl">
          
          {/* Video/Image Preview Container */}
          <div className="tab__video relative w-full aspect-video overflow-hidden">
            <div className="tab__demo w-full h-full relative">
              {/* Asset prioritized from instructions: img_5_693ada0d9f879dafcd-6.avif */}
              <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/78a43ddf-8c39-4e5b-8c2e-19e48920b783-nicolaromei-com/assets/images/69450a856a28f12fd88f17ac_imgi_5_693ada0d9f879dafcd-6.avif"
                alt="The Artboard Experience Explanation"
                fill
                priority
                className="object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
              />
              
              {/* Overlay Fade to match original UI */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0a0a0a] to-transparent opacity-40"></div>
              
              {/* Loading Indicator Placeholder (matching SVG structure) */}
              <div className="bunny-bg__loading absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                 <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
              </div>
            </div>
          </div>

          {/* Description Content */}
          <div className="tab__desc p-5 pt-8 bg-[#0a0a0a]">
            <p className="paragraph text-[11px] leading-[1.6] text-white font-mono uppercase tracking-widest mb-8">
              SCROLL / DRAG <span className="opacity-60">TO INTERACT W/ </span>THE CANVAS 
              <span className="italic mx-1 lowercase font-normal">or</span> 
              <span className="opacity-60"> click on the grid </span>
              to explore the archive.
              <br /><br />
              THE ARTBOARD SERVES AS A STRUCTURED ENVIRONMENT WHERE CREATIONS, SYSTEMS, AND DESIGN RESEARCH ACCUMULATED OVER TIME ARE ORGANIZED, PRESERVED, AND CONTINUOUSLY REVISITED.
            </p>

            {/* Close Button Component */}
            <div className="flex justify-start">
              <button 
                onClick={() => setIsVisible(false)}
                className="group relative px-6 py-2 border border-white overflow-hidden transition-colors duration-300 hover:text-[#0a0a0a]"
              >
                {/* Staggered Background Animation Layer */}
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                
                {/* Button Text with Character Staggering Concept */}
                <span className="relative z-10 text-[11px] font-bold tracking-[0.2em] flex gap-[0.1em]">
                  {["C", "L", "O", "S", "E"].map((char, i) => (
                    <span 
                      key={i} 
                      className="inline-block transform transition-transform duration-300 group-hover:-translate-y-1"
                      style={{ transitionDelay: `${i * 30}ms` }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero__tab {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}