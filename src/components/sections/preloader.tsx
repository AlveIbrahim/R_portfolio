"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const ASSETS = [
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/78a43ddf-8c39-4e5b-8c2e-19e48920b783-nicolaromei-com/assets/images/69452788e703150440dd4180_nr__made-1.avif",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/78a43ddf-8c39-4e5b-8c2e-19e48920b783-nicolaromei-com/assets/images/69450a8530b7cb5397f735b1_imgi_2_694029f4e8c0a6ddee-2.avif",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/78a43ddf-8c39-4e5b-8c2e-19e48920b783-nicolaromei-com/assets/images/6945261f9b350c9f511e4300_nr__works-3.avif",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/78a43ddf-8c39-4e5b-8c2e-19e48920b783-nicolaromei-com/assets/images/69450a858ed0e64cbb06769b_imgi_2_693721763652e19186-4.avif",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/78a43ddf-8c39-4e5b-8c2e-19e48920b783-nicolaromei-com/assets/images/69450a859b114fff691426d7_imgi_4_693addb991bb467302-5.avif"
];

const INTRO_TEXT = "WHAT APPEARS HERE IS NOT A SHOWCASE, BUT THE TRACE OF A PRACTICE";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [startFadeOut, setStartFadeOut] = useState(false);
  
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total loading time
    const intervalTime = 20; // 20ms steps
    const steps = duration / intervalTime;
    const progressPerStep = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setStartFadeOut(true), 500);
          setTimeout(() => setIsVisible(false), 1500); // Complete removal
          return 100;
        }
        return Math.min(prev + progressPerStep, 100);
      });
    }, intervalTime);

    // Image sequence timing (staggered across the progress)
    const imgInterval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % ASSETS.length);
    }, 150);

    return () => {
      clearInterval(timer);
      clearInterval(imgInterval);
    };
  }, []);

  if (!isVisible) return null;

  const words = INTRO_TEXT.split(" ");

  return (
    <div 
      ref={loaderRef}
      className={`fixed inset-0 z-[160] flex flex-col items-center justify-center bg-[#f3f3f3] transition-opacity duration-1000 ease-in-out ${startFadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center">
        {/* Rapid Image Sequence */}
        <div className="relative w-[56px] h-[70px] mb-[21px] rounded-[2.8px] overflow-hidden bg-transparent">
          {ASSETS.map((src, idx) => (
            <div 
              key={idx} 
              className={`absolute inset-0 transition-opacity duration-75 ${idx === currentImgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <Image 
                src={src} 
                alt="" 
                fill
                className="object-cover grayscale contrast-[1.1]"
              />
            </div>
          ))}
        </div>

        {/* Percentage and Line */}
        <div className="flex flex-col items-center mb-12 w-full max-w-[200px]">
          <div className="font-mono text-[14px] leading-none mb-2 text-[#202020] tabular-nums">
            {Math.floor(progress)}
          </div>
          <div className="w-full h-[1px] bg-black/10 relative overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-[#202020] transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Split-char Introductory Text */}
        <div className="max-w-[400px] text-center px-5">
          <div className="flex flex-wrap justify-center gap-x-[0.4em] gap-y-1">
            {words.map((word, wordIdx) => (
              <div key={wordIdx} className="flex overflow-hidden">
                {word.split('').map((char, charIdx) => {
                  const delay = (wordIdx * 0.05) + (charIdx * 0.02);
                  return (
                    <span 
                      key={charIdx}
                      className="inline-block font-mono text-[11px] leading-tight text-[#202020] uppercase tracking-[0.05em] translate-y-full animate-[slideUp_0.5s_ease-out_forwards]"
                      style={{ 
                        animationDelay: `${delay}s`,
                        animationFillMode: 'forwards' 
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Progressive Blur and Grid Overlays from Parent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="crt-overlay opacity-30" />
      </div>
    </div>
  );
}
