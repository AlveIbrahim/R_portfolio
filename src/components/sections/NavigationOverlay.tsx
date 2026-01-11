"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const NavigationOverlay = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/Rome",
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
    <div className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
      {/* Top Navigation Grid */}
      <nav className="grid-layout w-full pointer-events-auto bg-transparent">
        {/* Column 1: Location & Clock */}
        <div className="grid-col flex flex-col justify-between min-h-[100px]">
          <div className="text-ui leading-tight">
            Based in Italy,<br />working globally.
          </div>
          <div className="text-ui font-mono mt-auto">
            {time || "00:00:00"} GMT+1
          </div>
        </div>

        {/* Column 2: Expertise */}
        <div className="grid-col flex flex-col min-h-[100px]">
          <div className="text-ui mb-4">(my.expertise)</div>
          <div className="flex flex-col gap-1">
            <span className="text-ui text-white">Art Direction</span>
            <span className="text-ui text-white">Web Design + Dev</span>
            <span className="text-ui text-white">Webflow Development</span>
          </div>
        </div>

        {/* Column 3: Social Contacts */}
        <div className="grid-col flex flex-col min-h-[100px]">
          <div className="text-ui mb-4">(social.contacts)</div>
          <div className="flex flex-col gap-1">
            <a 
              href="https://www.awwwards.com/nicolaromei/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-ui text-white hover:opacity-60 transition-opacity underline decoration-[#666666] underline-offset-4"
            >
              Awwwards
            </a>
            <a 
              href="https://www.linkedin.com/in/nicolaromei/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-ui text-white hover:opacity-60 transition-opacity underline decoration-[#666666] underline-offset-4"
            >
              Linkedin
            </a>
            <a 
              href="mailto:info@nicolaromei.com?subject=New project together" 
              className="text-ui text-white hover:opacity-60 transition-opacity underline decoration-[#666666] underline-offset-4"
            >
              contacts
            </a>
          </div>
        </div>

        {/* Column 4: Hero Description (Intro Text) */}
        <div className="grid-col col-span-1 flex flex-col min-h-[100px]">
          <div className="max-w-[320px]">
            <p className="text-ui text-white lowercase leading-[1.4] tracking-normal">
              Digital Experience Designer and Awwwards Judge. I create immersive websites defined by strong visual direction, refined motion, and a distinct design signature.
            </p>
          </div>
        </div>

        {/* Column 5: Utility Buttons */}
        <div className="grid-col flex flex-col gap-0 min-h-[100px] border-r-0">
          <Link 
            href="/the-archive" 
            className="group relative flex items-center justify-center border border-white h-1/2 overflow-hidden bg-black transition-colors hover:bg-white"
          >
            <span className="text-ui font-bold text-white group-hover:text-black transition-colors z-10 px-4">
              THE ARCHIVE
            </span>
          </Link>
          <Link 
            href="/the-profile" 
            className="group relative flex items-center justify-center border border-white border-top-0 h-1/2 overflow-hidden bg-black transition-colors hover:bg-white"
          >
            <span className="text-ui font-bold text-white group-hover:text-black transition-colors z-10 px-4">
              THE PROFILE
            </span>
          </Link>
        </div>
      </nav>

      {/* Progressive Blurs */}
      <div className="blur-panel blur-top" />
      
      {/* CSS-only CRT Scanlines (as specified in Design Requirements) */}
      <style jsx global>{`
        .grid-layout {
          display: grid;
          grid-template-columns: 1.25fr 1fr 1fr 2fr 1.25fr;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .grid-col {
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.25rem;
        }

        .text-ui {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666666;
        }

        @media (max-width: 1024px) {
          .grid-layout {
            grid-template-columns: 1fr 1fr;
          }
          .grid-col:nth-child(n+3) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default NavigationOverlay;