"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Data from the HTML reference (JSON-LD)
const ARCHIVE_ITEMS = [
  {
    id: "001",
    name: "RETRONOVA",
    description: "A retro-futurist vision shaped through AI imagery, cinematic motion and luminous soundscapes. Metallic silhouettes, fashion influences and synthetic memories merge into an immersive environment where nostalgia bends toward a future that never existed but still feels strangely real.",
    image: "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/6946aee2d5baa87147c2e8a6_012.avif",
    link: "/works/retronova"
  },
  {
    id: "002",
    name: "NICOLA ROMEI",
    description: "This portfolio unfolds as an exposed process, gathering AI sketches, drafts, typographic tests and structural studies into a single immersive artboard. A brutalist grid and subtle WebGL depth shape a space where experimentation and identity quietly define each other.",
    image: "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/694029d027fe59a7816159a8_portfolio.avif",
    link: "/works/nicola-romei"
  },
  {
    id: "003",
    name: "CREATIVE LEAP",
    description: "A calm digital narrative built from soft gradients, gentle transitions and a restrained visual rhythm. Innovation becomes tactile as AI integrates into each scene with quiet clarity, shaping an elegant experience that turns complexity into a natural and intuitive flow.",
    image: "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/693721763652e191864f3eb4_creative__cover.avif",
    link: "/works/creative-leap"
  },
  {
    id: "004",
    name: "MADE IN EVOLVE",
    description: "A tech-editorial environment defined by bold typography, clean imagery and sharp structural clarity. Each layout balances discipline and momentum, creating a refined digital presence where innovation becomes a precise visual language that moves confidently forward.",
    image: "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/6946aec9e99131721ceef21a_005.avif",
    link: "/works/made-in-evolve"
  },
  {
    id: "005",
    name: "VALSAVARENCHE",
    description: "A landscape of grain, muted tones and cartographic textures evokes the rugged stillness of alpine territory. Vintage-park cues and weathered visuals form an atmosphere of exploration, transforming the valley's geography into a quiet, immersive field of memory and terrain.",
    image: "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/694029c5ad73f5c76043d0e6_valsa1.avif",
    link: "/works/valsavarenche"
  },
  {
    id: "006",
    name: "DAVIDE CATTANEO",
    description: "A data-driven digital environment built around clarity, precision, and controlled intensity. Dark surfaces, neon accents, and immersive scroll interactions translate analytical thinking into a visual system where information feels alive, dynamic, and intentionally structured.",
    image: "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/6946b8886bc039784bf61671_davide_cattaneo.avif",
    link: "/works/davide-cattaneo"
  },
  {
    id: "007",
    name: "STUDIES IN FORM",
    description: "Experimental studies exploring form, light, and texture through digital mediums.",
    image: "https://cdn.prod.website-files.com/6928a719958d854622ebb56e/6954f1160106cc5786ba0dad_HUMENOIDE.avif",
    link: "/works/studies-in-form"
  }
];

const ArchiveLayout = () => {
  const [activeItem, setActiveItem] = useState(ARCHIVE_ITEMS[0]);
  const [hoveredItem, setHoveredItem] = useState<typeof ARCHIVE_ITEMS[0] | null>(null);
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat("en-GB", options);
      setTime(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#e7e7e7] text-[#1E1E1E] md:overflow-hidden overflow-y-auto font-mono selection:bg-[#1E1E1E] selection:text-[#e7e7e7]">
      
      {/* CRT Overlay Effects */}
      <div className="crt-overlay fixed inset-0 z-[9999] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_50%,rgba(0,0,0,0.1)_100%)] z-10 animate-flicker" />
      </div>

      {/* Navigation / Header */}
      <div className="fixed top-0 left-0 w-full p-8 flex justify-between items-start z-50 text-[11px] uppercase tracking-wider">
        <Link href="/" className="group relative">
          <span className="font-bold">BACK TO CANVAS™</span>
          <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>

        <div className="text-right max-w-[300px] hidden md:block opacity-60">
          THIS ISN’T A TIMELINE OF WORK, BUT A CATALOG OF INTENTIONS.
          CONTEXTS SHIFT, MATERIALS CHANGE THE COMMITMENT TO SPACE, LIGHT, AND CLARITY REMAINS.
        </div>
        
        {/* Mobile Header Right Side (Optional, based on screenshot showing THE PROFILE?) */}
        <div className="md:hidden font-bold underline decoration-1 underline-offset-4">
          THE PROFILE
        </div>
      </div>

      <div className="fixed top-12 left-8 text-[11px] opacity-60 z-50">
        {mounted ? time : "00:00:00"} GMT+6
      </div>

      {/* MOBILE LAYOUT (Visible only on small screens) */}
      <div className="md:hidden w-full pt-32 px-4 pb-20">
        {/* Intro Text */}
        <div className="mb-12 text-[11px] uppercase leading-relaxed opacity-60 max-w-[90%]">
          WHAT APPEARS HERE IS NOT A SEQUENCE OF OUTCOMES, BUT A RECORD OF DECISIONS.
          DIFFERENT CONTEXTS, DIFFERENT CONSTRAINTS, THE SAME INSISTENCE ON CLARITY, STRUCTURE, AND PRESENCE.
          <br /><br />
          THIS ARCHIVE DOES NOT COLLECT RESULTS.
          IT PRESERVES PROCESS.
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-8 opacity-90">
          ( THE ARCHIVE )
        </h1>

        {/* Project Cards */}
        <div className="space-y-12">
          {ARCHIVE_ITEMS.map((item) => (
            <div key={item.id} className="w-full">
              {/* Image */}
              <div className="w-full aspect-square bg-[#dcdcdc] mb-3 overflow-hidden relative border border-black/5">
                <Image 
                  src={item.image} 
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-black/5 mix-blend-overlay" />
              </div>

              {/* Meta */}
              <div className="flex justify-between items-baseline text-[12px] font-bold mb-3 tracking-wide">
                <span className="opacity-50">({item.id})</span>
                <span className="uppercase">{item.name}</span>
              </div>

              {/* Description */}
              <div className="text-[10px] uppercase leading-relaxed opacity-70 mb-4 border-l border-black/20 pl-3">
                {item.description}
              </div>

              {/* Button */}
              <Link 
                href={item.link} 
                className="block w-full bg-[#e7e7e7] border border-black/20 py-2 text-center text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-all tracking-wider"
              >
                EXPLORE CASE
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP LAYOUT (Hidden on mobile, visible on md+) */}
      <div className="hidden md:flex relative w-full h-screen flex-col md:flex-row pt-32 pb-12 px-8">
        
        {/* Left: List */}
        <div className="w-full md:w-1/3 flex flex-col justify-center z-20">
          <div className="space-y-1">
            {ARCHIVE_ITEMS.map((item) => (
              <div 
                key={item.id}
                className="group flex items-center gap-8 py-2 border-b border-transparent hover:border-black/10 cursor-pointer transition-colors"
                onMouseEnter={() => {
                  setHoveredItem(item);
                  setActiveItem(item);
                }}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-baseline gap-4 min-w-[140px]">
                  <span className="text-[10px] opacity-50">({item.id})</span>
                  <span className="text-[12px] font-bold tracking-wide">{item.name}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] underline decoration-1 underline-offset-4 whitespace-nowrap">
                  SEE CASE
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Image Preview */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
           <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] overflow-hidden bg-[#dcdcdc]">
             {/* Render active item image */}
             <Image 
               src={activeItem.image} 
               alt={activeItem.name}
               fill
               className="object-cover transition-opacity duration-500 ease-out"
               sizes="(max-width: 768px) 100vw, 450px"
               priority
             />
             
             {/* Glitch/Overlay effect on image */}
             <div className="absolute inset-0 bg-black/5 mix-blend-overlay" />
           </div>
        </div>

        {/* Right: Description / Info */}
        <div className="hidden md:flex w-1/3 ml-auto flex-col justify-center items-end text-right z-20 pointer-events-none">
           <div className="max-w-[200px] space-y-8 opacity-60 text-[10px] uppercase leading-relaxed">
             <p>
               THIS SPACE HOLDS<br/>
               PROJECTS_<br/>
               TESTS_<br/>
               VISUAL SYSTEMS_
             </p>
           </div>
        </div>

      </div>

      {/* Footer Controls */}
      <div className="fixed bottom-0 left-0 w-full p-8 flex justify-between items-end z-50 text-[10px] uppercase">
         <div className="opacity-40">LATEST WORKS</div>
         <div className="flex gap-1 bg-black text-white p-1">
            <span className="bg-white text-black px-2 py-0.5 font-bold">GALLERY</span>
            <span className="px-2 py-0.5 opacity-50">LIST</span>
         </div>
         <div className="opacity-40">ARCHIVE 2026©</div>
      </div>

      {/* Global Styles for specific animations */}
      <style jsx global>{`
        @keyframes flicker {
          0% { opacity: 0.95; }
          50% { opacity: 0.92; }
          100% { opacity: 0.96; }
        }
        .animate-flicker {
          animation: flicker 0.15s infinite;
        }
      `}</style>
    </div>
  );
};

export default ArchiveLayout;
